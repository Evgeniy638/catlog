FROM adoptopenjdk:11-jre-hotspot
ARG JAR_FILE=./target/*.jar
COPY ${JAR_FILE} application.jar
ENTRYPOINT ["java", "-jar", "-Dspring.datasource.url=$DB_URL", "-Dspring.datasource.username=$DB_USERNAME", "-Dspring.datasource.password=$DB_PASSWORD", "application.jar"]
