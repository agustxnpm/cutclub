package com.cutclub.api.infrastructure.config;

import com.cutclub.api.infrastructure.security.JwtAccessDeniedHandler;
import com.cutclub.api.infrastructure.security.JwtAuthenticationEntryPoint;
import com.cutclub.api.infrastructure.security.JwtAuthenticationFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   JwtAuthenticationFilter jwtAuthenticationFilter,
                                                   JwtAuthenticationEntryPoint authenticationEntryPoint,
                                                   JwtAccessDeniedHandler accessDeniedHandler) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(eh -> eh
                    .authenticationEntryPoint(authenticationEntryPoint)
                    .accessDeniedHandler(accessDeniedHandler))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Endpoints públicos: login y registro de cuenta
                .requestMatchers("/api/v1/auth/**").permitAll()
                // Legacy: endpoints de auth de cliente (mantenidos por compatibilidad)
                .requestMatchers("/api/v1/clientes/auth/**").permitAll()

                // Operación del barbero: gestión de cortes y clientes
                .requestMatchers(HttpMethod.POST, "/api/v1/cortes/**").hasRole("BARBERO")
                .requestMatchers(HttpMethod.POST, "/api/v1/clientes").hasRole("BARBERO")
                .requestMatchers(HttpMethod.GET, "/api/v1/clientes").hasRole("BARBERO")
                .requestMatchers(HttpMethod.GET, "/api/v1/clientes/buscar").hasRole("BARBERO")
                .requestMatchers("/api/v1/referidos/**").hasRole("BARBERO")

                // El cliente accede a su propio perfil (BARBERO también puede consultarlo)
                .requestMatchers(HttpMethod.GET, "/api/v1/clientes/*/perfil").hasAnyRole("CLIENTE", "BARBERO")

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Permite cualquier origen localhost (puerto del devserver de Expo, etc.) y redes LAN.
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "http://127.0.0.1:*",
                "http://192.168.*.*",
                "http://10.*.*.*",
                "http://172.16.*.*"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // todo el árbol, no solo /api/**
        return source;
    }

    /**
     * Registrar CorsFilter como @Bean garantiza que se ejecute ANTES que el filtro de
     * autenticación de Spring Security. Esto hace que incluso las respuestas de error
     * (401, 403) lleven los headers Access-Control-Allow-*, evitando el bug donde el
     * navegador reporta un error CORS en lugar del error HTTP real.
     */
    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}
