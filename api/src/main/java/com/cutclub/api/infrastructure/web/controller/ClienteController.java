package com.cutclub.api.infrastructure.web.controller;

import com.cutclub.api.application.service.BuscarClientesUseCase;
import com.cutclub.api.application.service.ObtenerPerfilClienteUseCase;
import com.cutclub.api.application.service.RegistrarClienteNuevoService;
import com.cutclub.api.domain.model.Cliente;
import com.cutclub.api.domain.model.PerfilCliente;
import com.cutclub.api.infrastructure.web.dto.ClienteResponse;
import com.cutclub.api.infrastructure.web.dto.PerfilClienteResponse;
import com.cutclub.api.infrastructure.web.dto.RegistrarClienteRequest;
import com.cutclub.api.infrastructure.web.mapper.ClienteResponseMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/clientes")
public class ClienteController {

    private final RegistrarClienteNuevoService registrarClienteNuevoService;
    private final BuscarClientesUseCase buscarClientesUseCase;
    private final ObtenerPerfilClienteUseCase obtenerPerfilClienteUseCase;
    private final ClienteResponseMapper responseMapper;

    public ClienteController(RegistrarClienteNuevoService registrarClienteNuevoService,
                             BuscarClientesUseCase buscarClientesUseCase,
                             ObtenerPerfilClienteUseCase obtenerPerfilClienteUseCase,
                             ClienteResponseMapper responseMapper) {
        this.registrarClienteNuevoService = registrarClienteNuevoService;
        this.buscarClientesUseCase = buscarClientesUseCase;
        this.obtenerPerfilClienteUseCase = obtenerPerfilClienteUseCase;
        this.responseMapper = responseMapper;
    }

    @PostMapping
    public ResponseEntity<ClienteResponse> registrarCliente(@Valid @RequestBody RegistrarClienteRequest request) {
        Cliente cliente = registrarClienteNuevoService.registrarCliente(
                request.nombre(),
                request.telefono()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(responseMapper.toResponse(cliente));
    }

    @GetMapping
    public ResponseEntity<List<ClienteResponse>> listarClientes() {
        List<ClienteResponse> clientes = buscarClientesUseCase.listar().stream()
                .map(responseMapper::toResponse)
                .toList();
        return ResponseEntity.ok(clientes);
    }

    @GetMapping("/buscar")
    public ResponseEntity<?> buscarClientes(@RequestParam(required = false) String query) {
        if (query == null || query.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "El parámetro 'query' es obligatorio"));
        }

        List<ClienteResponse> resultados = buscarClientesUseCase.buscar(query).stream()
                .map(responseMapper::toResponse)
                .toList();

        return ResponseEntity.ok(resultados);
    }

    @GetMapping("/{id}/perfil")
    public ResponseEntity<PerfilClienteResponse> obtenerPerfil(@PathVariable String id) {
        PerfilCliente perfil = obtenerPerfilClienteUseCase.obtener(id);
        return ResponseEntity.ok(responseMapper.toResponse(perfil));
    }
}
