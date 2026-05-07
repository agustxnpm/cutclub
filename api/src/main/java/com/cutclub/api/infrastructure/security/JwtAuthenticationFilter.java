package com.cutclub.api.infrastructure.security;

import com.cutclub.api.domain.port.TokenProvider;
import com.cutclub.api.domain.port.TokenProvider.DatosToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

/**
 * Filtro que intercepta cada petición, extrae el JWT del header Authorization
 * y, si es válido, popula el SecurityContext con la identidad y roles correspondientes.
 *
 * No corta la petición ante un token inválido o ausente: simplemente no autentica;
 * la cadena de filtros decidirá luego si el endpoint requiere autenticación.
 */
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";
    private static final String ROLE_PREFIX = "ROLE_";

    private final TokenProvider tokenProvider;

    public JwtAuthenticationFilter(TokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        Optional<String> token = extraerToken(request);
        if (token.isPresent() && SecurityContextHolder.getContext().getAuthentication() == null) {
            tokenProvider.validar(token.get()).ifPresent(datos -> autenticar(datos, request));
        }
        filterChain.doFilter(request, response);
    }

    private Optional<String> extraerToken(HttpServletRequest request) {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            return Optional.empty();
        }
        String token = header.substring(BEARER_PREFIX.length()).trim();
        return token.isEmpty() ? Optional.empty() : Optional.of(token);
    }

    private void autenticar(DatosToken datos, HttpServletRequest request) {
        List<SimpleGrantedAuthority> authorities = datos.roles().stream()
                .map(rol -> new SimpleGrantedAuthority(ROLE_PREFIX + rol.name()))
                .toList();

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(datos.telefono(), null, authorities);
        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(auth);
    }
}
