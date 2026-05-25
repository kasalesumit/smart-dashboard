FROM nginx:alpine

COPY dist/smart-dashboard/browser /usr/share/nginx/html

EXPOSE 80