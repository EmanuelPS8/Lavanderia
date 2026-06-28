const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/projeto01', {
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Seed default admin user
        const Usuario = require('../models/Usuario');
        const adminExists = await Usuario.findOne({ email: 'admin@bofegatu.com' });
        if (!adminExists) {
            const defaultAdmin = new Usuario({
                nome: 'Administrador BOFEGATU',
                email: 'admin@bofegatu.com',
                senha_hash: 'admin123',
                perfil: 'admin',
                ativo: true
            });
            await defaultAdmin.save();
            console.log('Default admin user seeded: admin@bofegatu.com / admin123');
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
