// src/cli/device-auth.service.ts
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as readline from 'readline';

@Injectable()
export class DeviceAuthService {
    private readonly logger = new Logger(DeviceAuthService.name);
    private readonly keycloakUrl =
        process.env.KEYCLOAK_URL || 'http://localhost:8080';
    private readonly realm = process.env.KEYCLOAK_REALM || 'device-demo';
    private readonly clientId =
        process.env.KEYCLOAK_CLIENT_ID || 'device-client';

    private rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    private ask(question: string): Promise<string> {
        return new Promise((resolve) => this.rl.question(question, resolve));
    }

    async authenticateViaDeviceFlow() {
        this.logger.log('Iniciando autenticação via Device Flow...\n');

        const confirm = await this.ask(
            'Deseja iniciar a autenticação? (s/n): ',
        );
        if (confirm.trim().toLowerCase() !== 's') {
            this.rl.close();
            return;
        }

        try {
            const authResponse = await axios.post(
                `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/auth/device`,
                new URLSearchParams({ client_id: this.clientId }).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            );

            const {
                device_code,
                user_code,
                verification_uri,
                verification_uri_complete,
                interval,
                expires_in,
            } = authResponse.data;

            console.log('\n🔗 Acesse e autentique-se:');
            console.log(`👉 ${verification_uri}`);
            console.log(`📄 Código: ${user_code}`);
            console.log(`✅ Link direto: ${verification_uri_complete}\n`);

            await this.ask('Pressione ENTER após autenticar...');

            const start = Date.now();
            while ((Date.now() - start) / 1000 < expires_in) {
                try {
                    const tokenResponse = await axios.post(
                        `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/token`,
                        new URLSearchParams({
                            grant_type:
                                'urn:ietf:params:oauth:grant-type:device_code',
                            device_code,
                            client_id: this.clientId,
                        }).toString(),
                        {
                            headers: {
                                'Content-Type':
                                    'application/x-www-form-urlencoded',
                            },
                        },
                    );

                    const { access_token, refresh_token } = tokenResponse.data;
                    this.logger.log('✅ Autenticação bem-sucedida!');
                    console.log(
                        'Access Token:',
                        access_token.slice(0, 50) + '...',
                    );
                    this.rl.close();
                    return;
                } catch (err: any) {
                    const error = err?.response?.data?.error;
                    if (
                        ['authorization_pending', 'slow_down'].includes(error)
                    ) {
                        await new Promise((res) =>
                            setTimeout(res, interval * 1000),
                        );
                    } else {
                        this.logger.error(
                            'Erro inesperado:',
                            err.response?.data || err.message,
                        );
                        break;
                    }
                }
            }

            console.log('⚠️ Tempo de autorização expirado.');
        } catch (err) {
            this.logger.error('Erro ao iniciar o fluxo:', err.message);
        } finally {
            this.rl.close();
        }
    }
}
