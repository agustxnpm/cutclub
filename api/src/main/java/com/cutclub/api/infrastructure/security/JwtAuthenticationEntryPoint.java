package com.cutclub.api.infrastructure.security;

import com.cutclub.api.domain.exception.CredencialesInvalidasException;
import com.cutclub.api.domain.exception.LicenciaExpiradaException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

/**
 * Devuelve 401 con un cuerpo JSON estándar cuando un endpoint protegido
 * recibe una petición sin autenticación (o con token inválido).
 */
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public JwtAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(jakarta.servlet.http.HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        Throwable cause = authException.getCause();
        int status = HttpServletResponse.SC_UNAUTHORIZED;
        String mensaje = "Autenticación requerida";

        if (cause instanceof LicenciaExpiradaException ex) {
            status = HttpServletResponse.SC_FORBIDDEN;
            mensaje = ex.getMessage();
        } else if (cause instanceof CredencialesInvalidasException ex) {
            mensaje = ex.getMessage();
        } else if (authException.getMessage() != null) {
            mensaje = authException.getMessage();
        }

        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(response.getOutputStream(), Map.of("error", mensaje));
    }
}
