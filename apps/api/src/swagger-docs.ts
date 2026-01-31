/**
 * Swagger JSDoc API Documentation
 * Contains OpenAPI annotations for all endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               preferences:
 *                 $ref: '#/components/schemas/InvestmentPreferences'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         description: Validation failed
 *       409:
 *         description: User already exists
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with credentials
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/user/preferences:
 *   get:
 *     summary: Get user's investment preferences
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User preferences
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 preferences:
 *                   $ref: '#/components/schemas/InvestmentPreferences'
 *       401:
 *         description: Unauthorized
 *   patch:
 *     summary: Update investment preferences
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InvestmentPreferences'
 *     responses:
 *       200:
 *         description: Preferences updated
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/wallets:
 *   get:
 *     summary: Get user's connected wallets
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of wallets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 wallets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Wallet'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/wallets/connect:
 *   post:
 *     summary: Connect a new wallet
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - walletAddress
 *               - blockchain
 *             properties:
 *               walletAddress:
 *                 type: string
 *               blockchain:
 *                 type: string
 *                 enum: [bitcoin, ethereum]
 *               nickname:
 *                 type: string
 *     responses:
 *       201:
 *         description: Wallet connected
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 wallet:
 *                   $ref: '#/components/schemas/Wallet'
 *       400:
 *         description: Invalid wallet address
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/wallets/{id}:
 *   delete:
 *     summary: Disconnect a wallet
 *     tags: [Wallets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Wallet disconnected
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet not found
 */

/**
 * @swagger
 * /api/analysis/generate:
 *   post:
 *     summary: Generate wallet analysis with AI insights
 *     description: Rate limited to 5 requests per hour
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - walletAddress
 *               - blockchain
 *             properties:
 *               walletAddress:
 *                 type: string
 *               blockchain:
 *                 type: string
 *                 enum: [bitcoin, ethereum]
 *     responses:
 *       200:
 *         description: Analysis generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 analysis:
 *                   $ref: '#/components/schemas/Analysis'
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Rate limit exceeded
 */

/**
 * @swagger
 * /api/analysis/history:
 *   get:
 *     summary: Get analysis history
 *     tags: [Analysis]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: blockchain
 *         schema:
 *           type: string
 *           enum: [bitcoin, ethereum]
 *     responses:
 *       200:
 *         description: Analysis history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 analyses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Analysis'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */

export { };
