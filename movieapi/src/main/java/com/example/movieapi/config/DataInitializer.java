package com.example.movieapi.config;

import com.example.movieapi.entity.User;
import com.example.movieapi.repository.UserRepository;
import com.example.movieapi.util.PasswordUtil;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public class DataInitializer {

    @Bean
    @Transactional
    CommandLineRunner initData(UserRepository userRepository) {
        return args -> {
            if (!userRepository.existsByEmail("admin@movieapp.com")) {
                User admin = new User();
                admin.setEmail("admin@movieapp.com");
                String adminPassword = "Admin@123";
                
                // Encrypt the password
                String encryptedPassword = PasswordUtil.encryptPassword(adminPassword);
                admin.setPassword(encryptedPassword);
                admin.setRole("ADMIN");
                admin.setActive(true);
                
                userRepository.save(admin);
                System.out.println("Admin user created successfully with email: admin@movieapp.com and password: " + adminPassword);
            }
        };
    }
} 