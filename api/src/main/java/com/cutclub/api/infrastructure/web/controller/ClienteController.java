package com.cutclub.api.infrastructure.web.controller;

import com.cutclub.api.application.service.RegistrarClienteNuevoService;
import com.cutclub.api.domain.model.Cliente;
import com.cutclub.api.infrastructure.web.dto.ClienteResponse;
import com.cutclub.api.infrastructure.web.dto.RegistrarClienteRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/clientes")
public class ClienteController {

    private final RegistrarClienteNuevoService registrarClienteNuevoService;

    public ClienteController(RegistrarClienteNuevoService registrarClienteNuevoService) {
        this.registrarClienteNuevoService = registrarClienteNuevoService;
    }

    @PostMapping
    public ResponseEntity<ClienteResponse> registrarCliente(@Valid @RequestBody RegistrarClienteRequest request) {
        Cliente cliente = registrarClienteNuevoService.registrarCliente(
                request.nombre(),
                request.telefono()
        );

        ClienteResponse response = new ClienteResponse(
                cliente.getId(),
                cliente.getNombre(),
                cliente.getTelefono(),
                cliente.getCodigoReferido(),
                cliente.getContadorFidelidad()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
