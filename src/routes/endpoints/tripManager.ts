// Trip manager endpoints and their documentation
import { Router } from 'express';
import { createTripHandler, getTripsHandler, deleteTripHandler } from '../../controllers/tripManagerController';

const router = Router();

/**
 * @openapi
 * /api/v1/saved_trips:
 *   post:
 *     tags:
 *      - Bonus tasks
 *     summary: Create a new trip
 *     description: Create a new trip with origin, destination, cost, duration, and type.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trip'
 *     responses:
 *       201:
 *         description: Trip created successfully
 *       400:
 *         description: Failed to create trip
 *   get:
 *     tags:
 *     - Bonus tasks
 *     summary: List all trips
 *     description: Retrieve a list of all saved trips.
 *     responses:
 *       200:
 *         description: A list of trips
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trip'
 *       400:
 *         description: Failed to fetch trips
 *
 * /api/v1/saved_trips/{id}:
 *   delete:
 *     tags:
 *     - Bonus tasks
 *     summary: Delete a trip
 *     description: Delete a trip by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The trip ID
 *     responses:
 *       200:
 *         description: Trip deleted successfully
 *       404:
 *         description: Trip not found
 *       400:
 *         description: Failed to delete trip
 */

router.post('/saved_trips', createTripHandler);
router.get('/saved_trips', getTripsHandler);
router.delete('/saved_trips/:id', deleteTripHandler);

export default router;
