import express, { Request, Response } from 'express';
import { pool } from '../db/db';

const router = express.Router();

// Rota para obter todos os clientes
router.get('/clientes', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM clientes');
        res.json(result.rows);
    } catch (error) {
        console.error('Error getting clientes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Rota para obter um cliente pelo ID
router.get('/clientes/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM clientes WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Cliente not found' });
        }
    } catch (error) {
        console.error('Error getting cliente by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Rota para criar um novo cliente
router.post('/clientes', async (req: Request, res: Response) => {
    const { username, email, telefone, latitude, longitude } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO clientes (username, email, telefone, latitude, longitude) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [username, email, telefone, latitude, longitude]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating cliente:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Rota para atualizar um cliente existente
router.put('/clientes/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, email, telefone, latitude, longitude } = req.body;
    try {
        const result = await pool.query(
            'UPDATE clientes SET username = $1, email = $2, telefone = $3, latitude = $4, longitude = $5 WHERE id = $6 RETURNING *',
            [username, email, telefone, latitude, longitude, id]
        );
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Cliente not found' });
        }
    } catch (error) {
        console.error('Error updating cliente:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Rota para excluir um cliente
router.delete('/clientes/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM clientes WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            res.json({ message: 'Cliente deleted successfully' });
        } else {
            res.status(404).json({ message: 'Cliente not found' });
        }
    } catch (error) {
        console.error('Error deleting cliente:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
