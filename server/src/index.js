const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

const env = require('./config/env');
const { connectDB } = require('./config/db');
const { initSocketIo } = require('./utils/socket');
const { errorHandler } = require('./middleware/errorHandler');
const { startScheduler } = require('./utils/scheduler');

const authRoutes = require('./routes/authRoutes');
const contestantRoutes = require('./routes/contestantRoutes');
const voteRoutes = require('./routes/voteRoutes');
const adminRoutes = require('./routes/adminRoutes');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

async function start() {
  await connectDB();

  // optional admin bootstrap
  if (process.env.ADMIN_SYSTEM_ID && process.env.ADMIN_PASSWORD) {
    const existing = await Admin.findOne({ systemId: process.env.ADMIN_SYSTEM_ID });
    if (!existing) {
      const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await Admin.create({ systemId: process.env.ADMIN_SYSTEM_ID, passwordHash, role: 'superadmin' });
      // eslint-disable-next-line no-console
      console.log('Bootstrap admin created');
    }
  }

  const app = express();
  const server = http.createServer(app);
  initSocketIo(server, env.clientOrigin);

  app.use(cors({ origin: env.clientOrigin, credentials: true }));
  app.use(helmet());
  app.use(compression());
  app.use(morgan('dev'));
  app.use(express.json({ limit: '2mb' }));
  app.use('/uploads', express.static(path.join(process.cwd(), 'server', 'uploads')));

  app.get('/', (req, res) => res.json({ ok: true, service: 'Kandara College Voting System API' }));
  app.use('/api/auth', authRoutes);
  app.use('/api/contestants', contestantRoutes);
  app.use('/api/votes', voteRoutes);
  app.use('/api/admin', adminRoutes);

  app.use(errorHandler);

  server.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${env.port}`);
  });

  // start schedule evaluator
  startScheduler();
}

start().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

