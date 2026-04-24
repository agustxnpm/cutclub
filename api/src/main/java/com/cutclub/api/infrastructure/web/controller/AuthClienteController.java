package com.cutclub.api.infrastructure.web.controller;

import com.cutclub.api.application.service.LoginClienteUseCase;
import com.cutclub.api.application.service.RegistrarCuentaClienteUseCase;
import com.cutclub.api.domain.model.Cliente;
import com.cutclub.api.infrastructure.web.dto.AuthClienteResponse;
import com.cutclub.api.infrastructure.web.dto.LoginClienteRequest;
import com.cutclub.api.infrastructure.web.dto.RegistroClienteAuthRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/clientes/auth")
public class AuthClienteController {

    private final LoginClienteUseCase loginClienteUseCase;
    private final RegistrarCuentaClienteUseCase registrarCuentaClienteUseCase;

    public AuthClienteController(LoginClienteUseCase loginClienteUseCase,
                                 RegistrarCuentaClienteUseCase registrarCuentaClienteUseCase) {
        this.loginClienteUseCase = loginClienteUseCase;
        this.registrarCuentaClienteUseCase = registrarCuentaClienteUseCase;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthClienteResponse> login(@Valid @RequestBody LoginClienteRequest request) {
        Cliente cliente = loginClienteUseCase.login(request.telefono(), request.contrasena());
        return ResponseEntity.ok(toResponse(cliente));
    }

    @PostMapping("/registro")
    public ResponseEntity<AuthClienteResponse> registro(@Valid @RequestBody RegistroClienteAuthRequest request) {
        Cliente cliente = registrarCuentaClienteUseCase.registrar(
                request.nombre(),
                request.telefono(),
                request.contrasena(),
                request.codigoReferido()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(cliente));
    }

    private AuthClienteResponse toResponse(Cliente cliente) {
        return new AuthClienteResponse(cliente.getId(), cliente.getNombre(), cliente.getTelefono());
    }
}
