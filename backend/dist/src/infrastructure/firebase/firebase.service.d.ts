import { OnModuleInit } from '@nestjs/common';
import { Auth } from 'firebase-admin/auth';
export declare class FirebaseService implements OnModuleInit {
    private app;
    onModuleInit(): void;
    getAuth(): Auth;
}
