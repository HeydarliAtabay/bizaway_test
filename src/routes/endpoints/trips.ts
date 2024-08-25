import { Router } from 'express';
import { getDefaultTrips, getFilteredTrips } from '../../controllers/tripsController';
import { validateGetTrips } from '../../middlewares/validateGetTrips';

const router = Router();

/**
 * @openapi
 * /api/v1/trips:
 *   get:
 *     tags:
 *     - Main task
 *     summary: GET trips from third party API
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

/**
 * @openapi
 * /api/v1/trips/filtered:
 *   get:
 *     tags:
 *     - Main task
 *     summary: GET filtered trips from third party API
 *     description: Get a list of trips with optional filtering options.
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
 *       - name: price_range
 *         in: query
 *         description: Optional price range filter.
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *           minItems: 2
 *           maxItems: 2
 *           description: Array with two numbers representing the minimum and maximum price.
 *       - name: transport_type
 *         in: query
 *         description: Optional filter by transport type.
 *         schema:
 *           type: string
 *           enum: [train, bus, flight]
 *           description: Filter by transport type.
 *     responses:
 *       200:
 *         description: Successful response containing filtered trip details
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
 *                   example: "Invalid price range."
 *                 error:
 *                   type: string
 *                   example: "Invalid price range or transport type value"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch trips from external API"
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Detailed error message"
 *                     status:
 *                       type: integer
 *                       example: 500
 *                     headers:
 *                       type: object
 *                       additionalProperties: true
 *                     data:
 *                       type: string
 *                       example: "Detailed error data"
 */
router.get('/trips/filtered', getFilteredTrips);

export default router;
