package com.cutclub.api.infrastructure.config;

import com.cutclub.api.application.service.AutenticarUsuarioUseCase;
import com.cutclub.api.application.service.BuscarClientesUseCase;
import com.cutclub.api.application.service.ObtenerPerfilClienteUseCase;
import com.cutclub.api.application.service.RegistrarClienteNuevoService;
import com.cutclub.api.application.service.RegistrarCorteUseCase;
import com.cutclub.api.application.service.RegistrarCuentaClienteUseCase;
import com.cutclub.api.application.service.ValidarReferidoUseCase;
import com.cutclub.api.domain.port.BeneficioRepository;
import com.cutclub.api.domain.port.ClienteRepository;
import com.cutclub.api.domain.port.CorteRepository;
import com.cutclub.api.domain.port.ReferidoRepository;
import com.cutclub.api.domain.port.TokenProvider;
import com.cutclub.api.domain.port.UsuarioRepository;
import com.cutclub.api.domain.service.CodificadorContrasena;
import com.cutclub.api.domain.service.CodigoReferidoGenerator;
import com.cutclub.api.infrastructure.adapter.service.CodificadorContrasenaImpl;
import com.cutclub.api.infrastructure.adapter.service.CodigoReferidoGeneratorImpl;
import com.cutclub.api.infrastructure.security.JwtAuthenticationFilter;
import com.cutclub.api.infrastructure.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanConfiguration {

    @Bean
    public CodigoReferidoGenerator codigoReferidoGenerator() {
        return new CodigoReferidoGeneratorImpl();
    }

    @Bean
    public CodificadorContrasena codificadorContrasena() {
        return new CodificadorContrasenaImpl();
    }

    @Bean
    public RegistrarClienteNuevoService registrarClienteNuevoService(
            ClienteRepository clienteRepository,
            CodigoReferidoGenerator codigoReferidoGenerator) {
        return new RegistrarClienteNuevoService(clienteRepository, codigoReferidoGenerator);
    }

    @Bean
    public BuscarClientesUseCase buscarClientesUseCase(ClienteRepository clienteRepository) {
        return new BuscarClientesUseCase(clienteRepository);
    }

    @Bean
    public ObtenerPerfilClienteUseCase obtenerPerfilClienteUseCase(ClienteRepository clienteRepository,
                                                                    ReferidoRepository referidoRepository) {
        return new ObtenerPerfilClienteUseCase(clienteRepository, referidoRepository);
    }

    @Bean
    public RegistrarCuentaClienteUseCase registrarCuentaClienteUseCase(
            ClienteRepository clienteRepository,
            ReferidoRepository referidoRepository,
            UsuarioRepository usuarioRepository,
            CodigoReferidoGenerator codigoReferidoGenerator,
            CodificadorContrasena codificadorContrasena,
            TokenProvider tokenProvider) {
        return new RegistrarCuentaClienteUseCase(clienteRepository, referidoRepository, usuarioRepository,
                codigoReferidoGenerator, codificadorContrasena, tokenProvider);
    }

    @Bean
    public RegistrarCorteUseCase registrarCorteUseCase(
            ClienteRepository clienteRepository,
            CorteRepository corteRepository,
            BeneficioRepository beneficioRepository,
            @Value("${cutclub.fidelidad.meta:5}") int metaFidelidad) {
        return new RegistrarCorteUseCase(clienteRepository, corteRepository, beneficioRepository, metaFidelidad);
    }

    @Bean
    public ValidarReferidoUseCase validarReferidoUseCase(
            ReferidoRepository referidoRepository,
            BeneficioRepository beneficioRepository) {
        return new ValidarReferidoUseCase(referidoRepository, beneficioRepository);
    }

    @Bean
    public TokenProvider tokenProvider(
            @Value("${cutclub.security.jwt.secret}") String secret,
            @Value("${cutclub.security.jwt.expiration-ms:86400000}") long expirationMs) {
        return new JwtTokenProvider(secret, expirationMs);
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(TokenProvider tokenProvider) {
        return new JwtAuthenticationFilter(tokenProvider);
    }

    @Bean
    public AutenticarUsuarioUseCase autenticarUsuarioUseCase(UsuarioRepository usuarioRepository,
                                                             CodificadorContrasena codificadorContrasena,
                                                             TokenProvider tokenProvider) {
        return new AutenticarUsuarioUseCase(usuarioRepository, codificadorContrasena, tokenProvider);
    }
}
