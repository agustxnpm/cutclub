package com.cutclub.api.infrastructure.web.controller;

import com.cutclub.api.domain.exception.BeneficioNoDisponibleException;
import com.cutclub.api.domain.exception.BeneficioNoEncontradoException;
import com.cutclub.api.domain.exception.ClienteNoEncontradoException;
import com.cutclub.api.domain.exception.ClienteYaExisteException;
import com.cutclub.api.domain.exception.CredencialesInvalidasException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ClienteNoEncontradoException.class)
    public ResponseEntity<Map<String, String>> handleClienteNoEncontrado(ClienteNoEncontradoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(ClienteYaExisteException.class)
    public ResponseEntity<Map<String, String>> handleClienteYaExiste(ClienteYaExisteException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(CredencialesInvalidasException.class)
    public ResponseEntity<Map<String, String>> handleCredencialesInvalidas(CredencialesInvalidasException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(BeneficioNoEncontradoException.class)
    public ResponseEntity<Map<String, String>> handleBeneficioNoEncontrado(BeneficioNoEncontradoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(BeneficioNoDisponibleException.class)
    public ResponseEntity<Map<String, String>> handleBeneficioNoDisponible(BeneficioNoDisponibleException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", ex.getMessage()));
    }
}
