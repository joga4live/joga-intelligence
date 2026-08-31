#!/usr/bin/env bash
# sincronizar.sh — pone tu copia local igual a lo que está publicado en GitHub.
#
# POR QUE EXISTE
# José publica subiendo archivos por la página de GitHub, no con `git push`.
# Eso hace que la copia local y GitHub se separen: el sitio queda bien, pero
# el repositorio local se queda atrás y acumula commits que nadie subió.
# El 28 de agosto de 2026 llevaban 7 commits de diferencia por un lado y 12
# por el otro. El peligro no es la diferencia en sí: es que un `git push`
# forzado desde la copia local habría BORRADO las subidas manuales.
#
# CUANDO CORRERLO
# Cada vez que subas archivos a GitHub a mano. Después de subir, no antes.
#
# QUE HACE
# Guarda un respaldo, y deja tu copia local idéntica a GitHub.
# No sube nada. No borra trabajo sin avisar.

set -u
cd "$(dirname "$0")" || exit 1

rojo=$'\033[0;31m'; verde=$'\033[0;32m'; amarillo=$'\033[0;33m'; fin=$'\033[0m'

echo "== Sincronizar copia local con GitHub =="
echo

# 1. Trabajo sin guardar: se avisa y se detiene. Nunca se pisa en silencio.
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "${rojo}ALTO.${fin} Tienes cambios sin guardar en estos archivos:"
  git status --short --untracked-files=no | sed 's/^/    /'
  echo
  echo "Si son cambios que quieres conservar, súbelos a GitHub primero."
  echo "Si ya no los quieres, bórralos con:  git checkout -- ."
  echo "Este script no toca nada mientras haya trabajo sin guardar."
  exit 1
fi

# 2. Traer el estado real de GitHub.
echo "Preguntando a GitHub qué hay publicado..."
if ! git fetch origin --quiet 2>/dev/null; then
  echo "${rojo}No se pudo contactar a GitHub.${fin} Revisa tu conexión."
  exit 1
fi

adelante=$(git rev-list --count origin/main..HEAD)
atras=$(git rev-list --count HEAD..origin/main)

if [ "$adelante" -eq 0 ] && [ "$atras" -eq 0 ]; then
  echo "${verde}Ya estaban iguales.${fin} No hay nada que hacer."
  exit 0
fi

echo
echo "  Cambios que tienes y GitHub no:  ${adelante}"
echo "  Cambios que GitHub tiene y tú no: ${atras}"
echo

# 3. Diferencias de contenido, que es lo que de verdad importa.
echo "Archivos con contenido distinto:"
if git diff --stat HEAD origin/main | grep -q .; then
  git diff --stat HEAD origin/main | sed 's/^/    /'
else
  echo "    ninguno — solo difiere la historia, no los archivos"
fi
echo

# 3-b. Avisar de archivos que DESAPARECERIAN.
# Trampa real: si subes a GitHub solo uno de varios archivos, alinear la copia
# local borra los que no subiste — incluido este mismo script. Hay que verlo
# ANTES de aceptar, no descubrirlo despues.
desaparecen=$(git diff --name-only --diff-filter=D HEAD origin/main)
if [ -n "$desaparecen" ]; then
  echo "${rojo}OJO: estos archivos existen en tu copia y NO en GitHub.${fin}"
  echo "Si continuas, ${rojo}se borran de tu disco${fin}:"
  echo "$desaparecen" | sed 's/^/    /'
  echo
  echo "Si alguno te importa, súbelo a GitHub primero y vuelve a correr esto."
  echo
fi

# 4. Respaldo antes de tocar nada.
marca=$(git log -1 --format=%cd --date=format:%Y%m%d-%H%M origin/main 2>/dev/null || echo backup)
respaldo="respaldo-antes-de-sincronizar-${marca}"
if git rev-parse --verify --quiet "$respaldo" >/dev/null; then
  respaldo="${respaldo}-$(git rev-parse --short HEAD)"
fi
git branch "$respaldo" HEAD 2>/dev/null && \
  echo "${verde}Respaldo guardado${fin} en la rama: ${respaldo}"
echo "  (para recuperarlo algún día:  git checkout ${respaldo})"
echo

# 5. Alinear.
echo "${amarillo}Tu copia local va a quedar igual a GitHub.${fin}"
printf "Escribe SI para continuar: "
read -r respuesta
if [ "$respuesta" != "SI" ]; then
  echo "Cancelado. No se cambió nada."
  exit 0
fi

git reset --hard origin/main --quiet && \
  echo "${verde}Listo.${fin} Tu copia local ya es idéntica a lo publicado en GitHub."
echo
echo "Nota: los archivos sin registrar (demo/, assets/video/) no se tocaron."
