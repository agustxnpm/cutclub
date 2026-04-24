package com.cutclub.api.infrastructure.web.controller;

import com.cutclub.api.application.service.ValidarReferidoUseCase;
import com.cutclub.api.infrastructure.web.dto.ValidarReferidoRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

/**
 * Adaptador web para las operaciones sobre vínculos de referido.
 *
 * [Infrastructure Layer]
 */
@RestController
@RequestMapping("/api/v1/referidos")
public class ReferidoController {

    private final ValidarReferidoUseCase validarReferidoUseCase;

    public ReferidoController(ValidarReferidoUseCase validarReferidoUseCase) {
        this.validarReferidoUseCase = validarReferidoUseCase;
    }

    /**
     * PATCH /api/v1/referidos/{id}/validar
     *
     * El barbero confirma si el cliente referido es verdaderamente un cliente nuevo.
     * El parámetro {id} es el UUID del cliente referido (referido_id en la tabla).
     *
     * @param id         UUID del cliente referido
     * @param request    { "esNuevoReal": true | false }
     * @return 204 No Content si la validación se procesa correctamente
     */
    @PatchMapping("/{id}/validar")
    public ResponseEntity<Void> validar(@PathVariable UUID id,
                                        @RequestBody @Valid ValidarReferidoRequest request) {
        validarReferidoUseCase.validar(id, request.esNuevoReal());
        return ResponseEntity.noContent().build();
    }
}
