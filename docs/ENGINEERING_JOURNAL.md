# ENGINEERING JOURNAL - Souza Encanto

## Problemas Encontrados

Nenhum problema crítico na primeira fase.

## Restrições Descobertas

- Nenhuma nova restrição identificada.

## Lições Aprendidas

- **Contexto:** Supabase alterou a nomenclatura de suas variáveis de ambiente na UI de inicialização para novos projetos.
- **Aprendizado:** A UI mais recente do Supabase muitas vezes fornece a variável `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` no lugar da tradicional `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Aplicação futura:** O código de inicialização do cliente Supabase deve ser agnóstico e aceitar ambas as variáveis, garantindo compatibilidade independentemente de qual aba de configuração o usuário copiou as credenciais.

## Débitos Técnicos

- **Nenhum.** O projeto inicia com 100% de conformidade técnica e de segurança.
