package com.example.movieapi;

import com.example.movieapi.entity.User;

import com.example.movieapi.repository.UserRepository;
import com.example.movieapi.util.PasswordUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    // Simulated database (Replace with actual DB lookup)
    private static final Map<String, String> USERS = new HashMap<>();
    private static final Map<String, String> ROLES = new HashMap<>();

//    static {
//        USERS.put("admin", "@Password1");
//       
//
//        ROLES.put("admin", "@Admin1");
//  
//    }

    public AuthController(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    // 🔹 Login Endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            String email = request.getEmail();
            String password = request.getPassword();

            if (email == null || password == null || email.isEmpty() || password.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Email and password are required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

            if (!PasswordUtil.matches(password, user.getPassword())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid credentials");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }

            String token = jwtUtil.generateToken(email, user.getRole());
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("role", user.getRole());
            response.put("email", email);
            response.put("redirect", user.getRole().equals("ADMIN") ? "/dashboard" : "/home");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // 🔹 Register Endpoint (Modified)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        try {
            String email = request.getEmail();
            String password = request.getPassword();

            if (email == null || password == null || email.isEmpty() || password.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Email and password are required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            if (!isValidEmail(email)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid email format");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            if (!PasswordUtil.isStrongPassword(password)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", PasswordUtil.getPasswordStrengthMessage(password));
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            if (userRepository.existsByEmail(email)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Email already registered");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
            }

            User user = new User();
            user.setEmail(email);
            user.setPassword(PasswordUtil.encryptPassword(password));
            
            // Set role based on email domain
            String role = email.endsWith("@movieapp.com") ? "ADMIN" : "USER";
            user.setRole(role);
            user.setActive(true);
            userRepository.save(user);

            String token = jwtUtil.generateToken(email, role);
            Map<String, String> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("token", token);
            response.put("email", email);
            response.put("role", role);
            response.put("redirect", role.equals("ADMIN") ? "/dashboard" : "/home");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    private boolean isValidEmail(String email) {
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        return email.matches(emailRegex);
    }
}
