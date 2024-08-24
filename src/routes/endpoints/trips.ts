import { Router } from 'express';
import { getDefaultTrips } from '../../controllers/tripsController';
import { validateGetTrips } from '../../middlewares/validateGetTrips';

const router = Router();

/**
 * @openapi
 * /api/v1/trips:
 *   get:
 *     summary: Trips endpoint
 *     description: Get a list of trips with sorting options.
 *     parameters:
 *       - name: origin
 *         in: query
 *         description: IATA 3-letter code of the origin.
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[A-Z]{3}$'
 *       - name: destination
 *         in: query
 *         description: IATA 3-letter code of the destination.
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[A-Z]{3}$'
 *       - name: sort_by
 *         in: query
 *         description: Sorting strategy. Either fastest or cheapest.
 *         required: true
 *         schema:
 *           type: string
 *           enum: [fastest, cheapest]
 *     responses:
 *       200:
 *         description: Successful response containing sorted trip details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   origin:
 *                     type: string
 *                   destination:
 *                     type: string
 *                   cost:
 *                     type: integer
 *                   duration:
 *                     type: integer
 *                   type:
 *                     type: string
 *                   id:
 *                     type: string
 *                   display_name:
 *                     type: string
 *       400:
 *         description: Bad request, invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid query parameters"
 *                 error:
 *                   type: string
 *                   example: "Invalid origin or destination code, or invalid sort_by value"
 */
router.get('/trips', validateGetTrips, getDefaultTrips);

export default router;
