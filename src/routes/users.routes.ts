import { Router} from "express";
import { withJWT } from "../middlewares";
import { createUser, getUsers, getUserById, updateUser, deleteUserById } from "../controllers"
const usersRouter = Router();

/**
 * @swagger

 * components:
 *    securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          -email
 *          -first_name
 *          -last_name
 *          -birthdate
 *        properties:
 *          id: 
 *            type: integer
 *            description: The auto-generated incremental id of the user
 *          first_name:
 *            type: string
 *          last_name:  
 *            type: string
 *          email:
 *            type: string
 *          country:
 *            type: string
 *          birthdate:
 *            type: string
 
 *      Pagination:
 *        type: object
 *        properties:
 *          total_items: 
 *            type: integer
 *          current_page: 
 *            type: integer
 *          items_per_page:
 *            type: integer  
 *          total_pages: 
 *            type: integer
 *          next_page: 
 *            type: integer
 *          prev_page:
 *            type: integer       
 */

/**
 * @swagger
 *  /users:
 *    get:
 *      security:
 *        - bearerAuth: []       
 *      summary: Get all users
 *      description: Use to request all users from server, min. 20 users per page, max. 1000 users per page
 *      responses:
 *        '200':
 *          description: A response object with an array of users and a pagination object
 *          content: 
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  items:
 *                    type: array
 *                    items:
 *                      $ref: "#/components/schemas/User"
 *                  pagination:
 *                    type: object
 *                    $ref: "#/components/schemas/Pagination"
 *        '400':
 *          description: Bad request. User ID must be an integer and larger than 0 or user does not exists
 *        '401':
 *          description: Authorization information is missing or invalid.
 *        '5XX':
 *          description: Unexpected error.
 *                
 *                 
 *      parameters:
 *          - in: query
 *            name: limit
 *            required: false
 *            minimum: 20
 *            maximum: 1000
 *            default: 100
 *            description: The number of users to be returned per page, default is 100 per page, min. 20 and max is 1000
 *            schema:
 *              type: integer
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *            description: Page number to be returned, default is 1
 *            minimum: 1
*/
usersRouter.get("/", withJWT, getUsers);

/**
 * @swagger
 *  /users:
 *    post:   
 *      summary: Create a new user
 *      description: Use to create a new user
 *      requestBody:
 *        description: required fields are (email, first_name, last_name and birthdate)
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        200:
 *          description: User created successfully
 *          content: 
 *            application/json:
 *              schema:
 *                type: object
 *                propierties:
 *                  $ref: "#/components/schemas/User"
 */
usersRouter.post("/",createUser);

/**
 * @swagger
 * /users/{userId}:
 *    get:   
 *      security:
 *        - bearerAuth: []  
 *      summary: Get a user by ID
 *      parameters:
 *        - in: path
 *          name: userId
 *          schema:
 *            type: integer
 *          required: true
 *          description: Numeric ID of the user to get
 * 
 *      responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Bad request. User ID must be an integer and larger than 0 or user does not exists
 *       '401':
 *         description: Authorization information is missing or invalid.
 *       '5XX':
 *         description: Unexpected error.
 * 
 * 
*/
usersRouter.get("/:userId", withJWT, getUserById);

/**
 * @swagger
 * /users/{userId}:
 *    put:
 *      security:
 *        - bearerAuth: []    
 *      summary: Update a user by ID
 *      parameters:
 *        - in: path
 *          name: userId
 *          schema:
 *            type: integer
 *          required: true
 *          description: Numeric ID of the user to update
 *      requestBody:
 *        description: Modifiable fields are (email, first_name, last_name and country)
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *                  $ref: '#/components/schemas/User'
 *      responses:
 *       '202':
 *         description: OK
 *       '400':
 *         description: Bad request. User ID must be an integer and larger than 0 or user does not exists
 *       '401':
 *         description: Authorization information is missing or invalid.
 *       '5XX':
 *         description: Unexpected error.
 * 
 * 
*/
usersRouter.put("/:userId", withJWT, updateUser);
/**
 * @swagger
 * /users/{userId}:
 *    delete:   
 *      security:
 *        - bearerAuth: []  
 *      summary: Delete a single user by ID
 *      parameters:
 *        - in: path
 *          name: userId
 *          schema:
 *            type: integer
 *          required: true
 *          description: Numeric ID of the user to delete
 * 
 *      responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Bad request. User ID must be an integer and larger than 0 or user does not exists
 *       '401':
 *         description: Authorization information is missing or invalid.
 *       '5XX':
 *         description: Unexpected error.
 * 
 * 
*/
usersRouter.delete("/:userId", withJWT, deleteUserById);


export default usersRouter;