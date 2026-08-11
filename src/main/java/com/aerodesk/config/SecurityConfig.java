package com.aerodesk.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import java.util.Base64;

@Configuration
public class SecurityConfig {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtEncoder jwtEncoder() {

        SecretKey key = new SecretKeySpec(
                Base64.getDecoder().decode(jwtSecret),
                "HmacSHA256"
        );

        return new NimbusJwtEncoder(
                new ImmutableSecret<>(key)
        );
    }

    @Bean
    public JwtDecoder jwtDecoder() {

        SecretKey key = new SecretKeySpec(
                Base64.getDecoder().decode(jwtSecret),
                "HmacSHA256"
        );

        return NimbusJwtDecoder
                .withSecretKey(key)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {

        JwtGrantedAuthoritiesConverter authoritiesConverter =
                new JwtGrantedAuthoritiesConverter();

        authoritiesConverter.setAuthoritiesClaimName("role");
        authoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter authenticationConverter =
                new JwtAuthenticationConverter();

        authenticationConverter.setJwtGrantedAuthoritiesConverter(
                authoritiesConverter
        );

        return authenticationConverter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationConverter jwtAuthenticationConverter)
            throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Public login/auth endpoints
                        .requestMatchers("/api/auth/**").permitAll()

                        // Temporary: keep user creation open while testing
                        .requestMatchers(HttpMethod.POST, "/api/users").hasRole("ADMIN")

                        // Admin-only actions
                        .requestMatchers(
                                "/api/tickets/*/assign/*"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/tickets/*"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/tickets/*"
                        ).hasRole("ADMIN")

                        // Technician or Admin actions
                        .requestMatchers(
                                "/api/tickets/*/status/*",
                                "/api/tickets/dashboard",
                                "/api/tickets/technician/*",
                                "/api/tickets/*/history"
                        ).hasAnyRole("TECHNICIAN", "ADMIN")

                        // Remaining ticket endpoints
                        .requestMatchers("/api/tickets/**")
                        .hasAnyRole("EMPLOYEE", "TECHNICIAN", "ADMIN")

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                )

                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(jwt ->
                                jwt.jwtAuthenticationConverter(
                                        jwtAuthenticationConverter
                                )
                        )
                );

        return http.build();
    }
}