export default {
    dsn: 'https://abcdefg@abcdefg.ingest.sentry.io/1234567', // Sentry DSN
    tracesSampleRate: 1.0,
    integrations: (integrations: any[]) => (
        integrations
            .filter(integration => ![ 'OnUnhandledRejection', 'OnUncaughtException' ].includes(integration.name))
    )
};