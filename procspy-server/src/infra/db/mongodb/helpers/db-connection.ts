import { Collection, MongoClient } from "mongodb";

class DbConnection {
    private connectionString?: string

    private client?: MongoClient


    async connect(connectionString: string) {
        this.connectionString = connectionString
        this.client = new MongoClient(connectionString)
        await this.client.connect()
    }

    async disconnect() {
        await this.client?.close()
        this.client = undefined

    }

    async getCollection(collectionName: string): Promise<Collection> {
        if (!this.client && this.connectionString) {
            await this.connect(this.connectionString)
        }
        const db = this.client?.db()
        if (!db) {
            throw new Error('Please Connect The Database (Database not Connected)')
        }
        return db.collection(collectionName)
    }

    async migration() {
        if (!this.client && this.connectionString) {
            await this.connect(this.connectionString);
        }
        const collectionMigrations = this.getCollection('migrations')
        const collectionUsers = this.getCollection('users')
        const collection = this.getCollection('flags');
        const globalSettingMigration = this.getCollection('global_settings')
        const migrationKey = 'initial-flags-seed';

        const alreadyMigrated = await (await collectionMigrations).findOne({ key: migrationKey });
        const flags = [
            { flagKey: "CONNECT", label: "User Connected", severity: 0 },
            { flagKey: "DISCONNECT", label: "User Disconnected", severity: 1 },
            { flagKey: "SWITCH_TAB", label: "User Switched Tab", severity: 3 },
            { flagKey: "MINIMIZE_WINDOW", label: "User Minimized or Resized Exam Window", severity: 4 },
            { flagKey: "WINDOW_OFF", label: "User Off from chrome (could be alt+tab)", severity: 8 },
            { flagKey: "USED_SHORTCUT", label: "User Used Shortcut", severity: 2 },
            { flagKey: "EXIT_FULLSCREEN", label: "User Exited Fullscreen Mode", severity: 6 },
            { flagKey: "MULTIPLE_MONITORS", label: "Multiple Monitors Detected", severity: 5 },
            { flagKey: "LOST_CONNECTION", label: "Transport Closed By Network", severity: 1 },
            { flagKey: "VM_DETECTED", label: "Virtual Machine Detected", severity: 8 },
            { flagKey: "NETWORK_CHANGE", label: "User Switched Wi-Fi/VPN/IP Mid-Session", severity: 4 },
            { flagKey: "CAMERA_FEED_LOST", label: "Webcam Feed Lost or Turned Off", severity: 7 },
            { flagKey: "SCREEN_VIDEO_LOST", label: "Screen Feed Lost or Turned Off", severity: 7 },
            { flagKey: "VIDEO_MANIPULATION", label: "Fake Webcam Software Detected", severity: 8 },
            { flagKey: "CAMERA_AUDIO_MUTED", label: "Microphone Muted Unexpectedly", severity: 3 },
            { flagKey: "SCREEN_AUDIO_MUTED", label: "Screen Audio Muted Unexpectedly", severity: 3 },
            { flagKey: "PROCTOR_STOPPED", label: "User Completed the Test", severity: 0 },
        ];

        const defaultGlobalSettings = [
            {
                "key": "MAX_SEVERITY",
                "value": "10"
            },
            {
                "key": "PLATFORM_DOMAIN",
                "value": "https://procspy.link"
            },
            {
                "key": "PLATFORM_NAME",
                "value": "APLIKASI SEKOLAH"
            },
            {
                "key": "PLATFORM_TYPE",
                "value": "DEFAULT"
            },
        ]

        const firstAccount =
        {
            "email": "admin@procspy.link",
            "password": "$2b$12$jP8HWx81NipyTJc5ca3aWOVzA5HGL/RXaAn8SYBVCVzAlKJx7fp0u",
            "username": "procspyadmin",
            "name": "Reza1290",
            "active" : true
        }


        await (await collection).deleteMany({});
        await (await globalSettingMigration).deleteMany({})
        await (await collectionUsers).findOneAndUpdate(
            { email: firstAccount.email },
            { $set: firstAccount },
            {
                upsert: true,
                returnDocument: 'after'
            }
        )

        await (await globalSettingMigration).insertMany(defaultGlobalSettings)
        await (await collection).insertMany(flags);

        await (await collectionMigrations).insertOne({
            key: migrationKey,
            appliedAt: new Date(),
        });

        console.log('Migration completed: Flags inserted.');
    }



}

export default new DbConnection()