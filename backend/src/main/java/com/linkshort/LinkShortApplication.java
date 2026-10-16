package com.linkshort;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LinkShortApplication {
    public static void main(String[] args) {
        SpringApplication.run(LinkShortApplication.class, args);
    }
}
