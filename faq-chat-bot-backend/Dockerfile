# Use OpenJDK 17 (or 21) image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy the built jar file (assuming your jar is inside target/)
COPY target/*.jar app.jar

# Expose port (Render uses PORT env var, so we pass it to Spring Boot)
EXPOSE 8080

# Command to run
CMD ["java", "-jar", "app.jar"] 