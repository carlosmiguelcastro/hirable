package com.castro.hirable;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    @GetMapping("/")
    public String root() {
        return "redirect:/navigation";
    }

    @GetMapping("/index")
    public String index() {
        return "index";
    }

    @GetMapping("/layouts/base")
    public String base() {
        return "layouts/base";
    }

    @GetMapping("/layouts/navigation")
    public String navigation() {
        return "layouts/navigation";
    }

    @GetMapping("/layouts/simplePage")
    public String simplePage() {
        return "layouts/simplePage";
    }

    @GetMapping("/user/index")
    public String userIndex() {
        return "user/index";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/login-error")
    public String loginError(Model model) {
        model.addAttribute("loginError", true);
        return "login";
    }
}
