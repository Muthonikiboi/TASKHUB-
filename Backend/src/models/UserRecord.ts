// models/UserRecord.ts

export interface UserRecord {
    useremail: string;        // User's email address
    userpassword: string;     // Hashed user password
    username: string;         // User's display name or username
    role: 'user' | 'admin';
    xata_id?: string; 
    resetToken?: string;         // Add these properties if they are not there
    resetTokenExpiry?: number;   // User's role, either 'user' or 'admin'
    // Add any other fields as needed
    createdAt?: Date;         // Optional field for when the user was created
    updatedAt?: Date;         // Optional field for when the user was last updated
}
