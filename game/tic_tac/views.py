from django.views.generic import TemplateView


class Index(TemplateView):
    template_name = "tic_tac/index.html"

