#!/bin/sh
# Entrada do container. O build no GitHub não alcança a API do DunasTour (só o IP do servidor é liberado), então as
# páginas saem da imagem sem os passeios; assim que o servidor sobe, chamamos /api/revalidate nele mesmo e as páginas
# são geradas de novo com os dados. Não depende do post-deployment command do Coolify.
if [ -n "$REVALIDATE_SECRET" ]; then
  (
    for i in 1 2 3 4 5 6 7 8 9 10; do
      sleep 2
      # Na porta em que o Next sobe: o Coolify pode passar PORT (ex.: 80) no lugar da 3000 da imagem.
      wget -qO- --post-data= "http://127.0.0.1:${PORT:-3000}/api/revalidate?secret=$REVALIDATE_SECRET" >/dev/null 2>&1 && break
    done
  ) &
fi
# O Coolify troca o HOSTNAME pelo nome do container; 0.0.0.0 mantém o Next escutando também em 127.0.0.1.
HOSTNAME=0.0.0.0 exec node server.js
