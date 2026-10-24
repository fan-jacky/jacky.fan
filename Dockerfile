# syntax=docker/dockerfile:1.7-labs

# The static site is built on the host (`pnpm build`, requires PAYLOAD_CMS_URL
# pointing at a reachable CMS) and this image only serves the output.

FROM nginx:1.27-alpine

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
