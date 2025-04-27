# Use OpenJDK 17 (or 21) image
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Use a smaller runtime image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port (Render uses PORT env var, so we pass it to Spring Boot)
EXPOSE 8080

# Command to run
CMD ["java", "-jar", "app.jar"] 