import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();
export const verifyFirebaseToken = async (req, res, next) => {
    try {
        if (admin.apps.length === 0) {
            const firebaseAdminJson = process.env.FIREBASE_ADMIN_SDK_JSON;
            const firebaseAdminPath = process.env.FIREBASE_ADMIN_SDK_PATH || './firebase-admin-sdk.json';
            let serviceAccount;
            if (firebaseAdminJson) {
                serviceAccount = JSON.parse(firebaseAdminJson);
            }
            else if (fs.existsSync(firebaseAdminPath)) {
                const absolutePath = path.resolve(firebaseAdminPath);
                serviceAccount = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
            }
            else {
                throw new Error('Firebase Admin credentials are not configured');
            }
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        }
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, email, ...rest } = decodedToken;
        req.user = {
            uid,
            ...rest,
            ...(email ? { email } : {}),
        };
        next();
    }
    catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};
