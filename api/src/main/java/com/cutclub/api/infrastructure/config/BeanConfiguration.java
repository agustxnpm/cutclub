package com.cutclub.api.infrastructure.config;

import com.cutclub.api.application.service.BuscarClientesUseCase;
import com.cutclub.api.application.service.LoginClienteUseCase;
import com.cutclub.api.application.service.ObtenerPerfilClienteUseCase;
import com.cutclub.api.application.service.RegistrarClienteNuevoService;
import com.cutclub.api.application.service.RegistrarCorteUseCase;
import com.cutclub.api.application.service.RegistrarCuentaClienteUseCase;
import com.cutclub.api.domain.port.BeneficioRepository;
import com.cutclub.api.domain.port.ClienteRepository;
import com.cutclub.api.domain.port.CorteRepository;
import com.cutclub.api.domain.port.ReferidoRepository;
import com.cutclub.api.domain.service.CodificadorContrasena;
import com.cutclub.api.domain.service.CodigoReferidoGenerator;
import com.cutclub.api.infrastructure.adapter.service.CodificadorContrasenaImpl;
import com.cutclub.api.infrastructure.adapter.service.CodigoReferidoGeneratorImpl;
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
    public ObtenerPerfilClienteUseCase obtenerPerfilClienteUseCase(ClienteRepository clienteRepository) {
        return new ObtenerPerfilClienteUseCase(clienteRepository);
    }

    @Bean
    public LoginClienteUseCase loginClienteUseCase(ClienteRepository clienteRepository,
                                                   CodificadorContrasena codificadorContrasena) {
        return new LoginClienteUseCase(clienteRepository, codificadorContrasena);
    }

    @Bean
    public RegistrarCuentaClienteUseCase registrarCuentaClienteUseCase(
            ClienteRepository clienteRepository,
            ReferidoRepository referidoRepository,
            CodigoReferidoGenerator codigoReferidoGenerator,
            CodificadorContrasena codificadorContrasena) {
        return new RegistrarCuentaClienteUseCase(clienteRepository, referidoRepository, codigoReferidoGenerator, codificadorContrasena);
    }

    @Bean
    public RegistrarCorteUseCase registrarCorteUseCase(
            ClienteRepository clienteRepository,
            CorteRepository corteRepository,
            BeneficioRepository beneficioRepository,
            @Value("${cutclub.fidelidad.meta:5}") int metaFidelidad) {
        return new RegistrarCorteUseCase(clienteRepository, corteRepository, beneficioRepository, metaFidelidad);
    }
}
