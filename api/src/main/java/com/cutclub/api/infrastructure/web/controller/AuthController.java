package com.cutclub.api.infrastructure.web.controller;

import com.cutclub.api.application.service.AutenticacionResult;
import com.cutclub.api.application.service.AutenticarUsuarioUseCase;
import com.cutclub.api.application.service.RegistrarCuentaClienteUseCase;
import com.cutclub.api.application.service.RegistrarCuentaClienteUseCase.RegistroClienteResult;
import com.cutclub.api.domain.model.Cliente;
import com.cutclub.api.domain.port.ClienteRepository;
import com.cutclub.api.infrastructure.web.dto.LoginRequest;
import com.cutclub.api.infrastructure.web.dto.LoginResponse;
import com.cutclub.api.infrastructure.web.dto.RegistroClienteRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

/**
 * Endpoint unificado de autenticación. Sirve a todos los roles (BARBERO, CLIENTE, ADMIN).
 *
 * - {@code POST /login}: emite token JWT a partir de credenciales.
 * - {@code POST /registro}: crea Usuario + Cliente con id compartido y emite token (auto-login).
 *
 * El campo {@code nombre} de la respuesta proviene del agregado Cliente (cuando existe);
 * para usuarios sin Cliente asociado (ej. BARBERO) será {@code null}.
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AutenticarUsuarioUseCase autenticarUsuarioUseCase;
    private final RegistrarCuentaClienteUseCase registrarCuentaClienteUseCase;
    private final ClienteRepository clienteRepository;

    public AuthController(AutenticarUsuarioUseCase autenticarUsuarioUseCase,
                          RegistrarCuentaClienteUseCase registrarCuentaClienteUseCase,
                          ClienteRepository clienteRepository) {
        this.autenticarUsuarioUseCase = autenticarUsuarioUseCase;
        this.registrarCuentaClienteUseCase = registrarCuentaClienteUseCase;
        this.clienteRepository = clienteRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        AutenticacionResult resultado = autenticarUsuarioUseCase.autenticar(
                request.telefono(), request.contrasena());

        // Resolución del nombre: por convención, Cliente.id == Usuario.id cuando aplica.
        String nombre = clienteRepository.buscarPorId(resultado.id())
                .map(Cliente::getNombre)
                .orElse(null);

        return ResponseEntity.ok(toResponse(resultado, nombre));
    }

    @PostMapping("/registro")
    public ResponseEntity<LoginResponse> registrar(@Valid @RequestBody RegistroClienteRequest request) {
        RegistroClienteResult resultado = registrarCuentaClienteUseCase.registrar(
                request.nombre(),
                request.telefono(),
                request.contrasena(),
                request.codigoReferido());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponse(resultado.autenticacion(), resultado.cliente().getNombre()));
    }

    private LoginResponse toResponse(AutenticacionResult resultado, String nombre) {
        return new LoginResponse(
                resultado.id(),
                resultado.token(),
                resultado.telefono(),
                nombre,
                resultado.roles().stream().map(Enum::name).collect(Collectors.toSet())
        );
    }
}
