package com.example.hotelbooking.security;

import com.example.hotelbooking.exceptions.CustomAccessDenialHandler;
import com.example.hotelbooking.exceptions.CustomAuthenticationEntryPoint;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityFilter {

    private final AuthFilter authFilter;
    private final CustomAccessDenialHandler customAccessDenialHandler;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // ❌ disable CSRF for REST APIs
                .csrf(AbstractHttpConfigurer::disable)

                // ✅ enable CORS (you already have CorsFilter bean)
                .cors(Customizer.withDefaults())

                // ❌ custom exception handling
                .exceptionHandling(exception ->
                        exception
                                .accessDeniedHandler(customAccessDenialHandler)
                                .authenticationEntryPoint(customAuthenticationEntryPoint)
                )

                // ✅ SECURITY RULES (FIXED)
                .authorizeHttpRequests(request -> request

                        // PUBLIC ENDPOINTS
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/rooms/**").permitAll()

                        // PROTECTED ENDPOINTS (FIXED)
                        .requestMatchers("/api/users/**").authenticated()
                        .requestMatchers("/api/bookings/**").authenticated()
                        .requestMatchers("/payments/**").authenticated()

                        // EVERYTHING ELSE
                        .anyRequest().authenticated()
                )

                // ❌ no sessions (JWT system)
                .sessionManagement(manager ->
                        manager.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // ✅ JWT FILTER
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ---------------------------
    // PASSWORD ENCODER
    // ---------------------------
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ---------------------------
    // AUTH MANAGER
    // ---------------------------
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration.getAuthenticationManager();
    }
}