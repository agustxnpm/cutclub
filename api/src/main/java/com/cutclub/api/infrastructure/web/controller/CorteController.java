package com.cutclub.api.infrastructure.web.controller;

import com.cutclub.api.application.service.CanjearCorteGratisUseCase;
import com.cutclub.api.application.service.RegistrarCorteUseCase;
import com.cutclub.api.domain.model.Corte;
import com.cutclub.api.infrastructure.web.dto.CanjearCorteGratisRequest;
import com.cutclub.api.infrastructure.web.dto.RegistrarCorteRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/cortes")
public class CorteController {

    private final RegistrarCorteUseCase registrarCorteUseCase;
    private final CanjearCorteGratisUseCase canjearCorteGratisUseCase;

    public CorteController(RegistrarCorteUseCase registrarCorteUseCase,
                           CanjearCorteGratisUseCase canjearCorteGratisUseCase) {
        this.registrarCorteUseCase = registrarCorteUseCase;
        this.canjearCorteGratisUseCase = canjearCorteGratisUseCase;
    }

    @PostMapping
    @PreAuthorize("hasRole('BARBERO')")
    public ResponseEntity<Map<String, String>> registrarCorte(@Valid @RequestBody RegistrarCorteRequest request) {
        Corte corte = registrarCorteUseCase.ejecutar(
                request.clienteId(),
                request.tipoCorte(),
                request.precio()
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("id", corte.id().toString()));
    }

    @PostMapping("/canje")
    @PreAuthorize("hasRole('BARBERO')")
    public ResponseEntity<Map<String, String>> canjearCorteGratis(@Valid @RequestBody CanjearCorteGratisRequest request) {
        Corte corte = canjearCorteGratisUseCase.ejecutar(
                request.clienteId(),
                request.beneficioId(),
                request.tipoCorte()
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("id", corte.id().toString(), "esGratis", String.valueOf(corte.esGratis())));
    }
}
