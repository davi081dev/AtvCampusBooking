# Registro de entrega da equipe

## Integrantes

- Nome completo: Davi Lucas Da Silva Pinheiro
- Nome completo: Hugo Vinícius de Lima Mendonça

## Correções de modelagem

O modelo inicial permitia `Booking.endAt` como opcional, não garantia que o término fosse posterior ao início e não impedia reservas com inicialização no mesmo minuto com precisão inferior à esperada. Foram preservadas a migration inicial e as restrições, adicionada a migration `20261126000100_booking_constraints` e aplicadas as seguintes correções no banco:

- `Booking.endAt` passou a ser obrigatório (`NOT NULL`);
- foi criada a constraint `Booking_endAt_after_startAt_check`, garantindo `endAt > startAt`;
- foram criadas constraints de precisão de minutos para `startAt` e `endAt`, impedindo segundos diferentes de zero;
- foi criado índice único em `roomId + startAt`, em conjunto com as verificações da aplicação para intervalos sobrepostos e conflito por usuário.

O schema Prisma já representa o conflito de início pela restrição `@@unique([roomId, startAt])`. As regras de negócio de intervalo, horário de funcionamento, reservas no passado, sala ativa e sobreposição são validadas pela camada de serviço antes das operações no banco.

## Endpoints e evidências

Para cada endpoint, informe se está concluído, parcialmente concluído ou não implementado. Registre a requisição (método, URL, body quando aplicável), status e resposta de pelo menos um cenário de sucesso e um de erro para cada endpoint implementado.

| Endpoint                                  | Situação  | Evidência de sucesso                                                                                                                                                                                                                                                                                                                                               | Evidência de erro                                                                                                                                                                                                                                                              |
| ----------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1. `GET /api/rooms`                       | Concluído | `GET /api/rooms?buildingId=1&type=LAB&active=true` → **200**; resposta: `[{"id":1,"name":"Laboratório 01","type":"LAB","capacity":30,"active":true,"buildingId":1}]`                                                                                                                                                                                               | `GET /api/rooms?buildingId=abc` → **400**; resposta: `{"error":"VALIDATION_ERROR","message":"Dados de entrada inválidos.","details":[{"field":"buildingId","message":"Invalid"},{"field":"buildingId","message":"Invalid input"}]}`                                            |
| 2. `GET /api/buildings/:buildingId/usage` | Concluído | `GET /api/buildings/1/usage?date=2026-11-27` → **200**; resposta resumida: `{"buildingId":1,"buildingName":"Campus Central","date":"2026-11-27","totalRooms":3,"totalBookings":5,"totalAvailableMinutes":2520,"totalBookedMinutes":360,"overallUsagePercentage":14.29}`                                                                                            | `GET /api/buildings/999/usage?date=2026-11-27` → **404**; resposta: `{"error":"BUILDING_NOT_FOUND","message":"Prédio não encontrado."}`                                                                                                                                        |
| 3. `POST /api/bookings`                   | Concluído | `POST /api/bookings` com `{"userId":15,"roomId":3,"startAt":"2026-11-27T11:00:00-03:00","endAt":"2026-11-27T12:00:00-03:00","purpose":"Projeto integrador"}` → **201**; resposta: `{"id":31,"userId":15,"roomId":3,"startAt":"2026-11-27T14:00:00.000Z","endAt":"2026-11-27T15:00:00.000Z","purpose":"Projeto integrador","createdAt":"2026-11-26T16:25:30.169Z"}` | Sala ocupada: mesmo payload sobreposto à sala 1 → **409**; resposta: `{"error":"ROOM_BOOKING_CONFLICT","message":"A sala já possui reserva nesse intervalo."}`. Também foi testada sala inativa 4 com → **409** e `{"error":"ROOM_INACTIVE","message":"A sala está inativa."}` |
| 4. `PATCH /api/bookings/:id`              | Concluído | `PATCH /api/bookings/1` com `{"purpose":"Reunião revisada"}` → **200**; a reserva 1 permaneceu com `purpose` atualizado.                                                                                                                                                                                                                                           | `PATCH /api/bookings/999` com `{"purpose":"Erro"}` → **404**; resposta: `{"error":"BOOKING_NOT_FOUND","message":"Reserva não encontrada."}`                                                                                                                                    |
| 5. `DELETE /api/bookings/:id`             | Concluído | `DELETE /api/bookings/1` → **204**, sem corpo de resposta.                                                                                                                                                                                                                                                                                                         | `DELETE /api/bookings/999` → **404**; resposta: `{"error":"BOOKING_NOT_FOUND","message":"Reserva não encontrada."}`                                                                                                                                                            |

## Observações

- A configuração foi concluída com `npm run setup`; o PostgreSQL foi criado no Docker Compose na porta 5434, as duas migrations foram aplicadas e o seed foi executado. O dia principal informado pelo seed foi `2026-11-27`.
- Validação executada: `npm run prisma:generate` concluiu com sucesso e `npm run build` compilou o projeto sem erros.
- Foram obtidas evidências reais dos cinco endpoints avaliativos por meio de requisições HTTP contra `http://localhost:3002`.
- Foi reiniciada a seed ao final dos testes para restaurar as fixtures originais do banco local.
- Não foi identificado um sistema de pontuação ou requisitos de conquistas da gamificação neste workspace; portanto, não há resultados de gamificação a registrar.
