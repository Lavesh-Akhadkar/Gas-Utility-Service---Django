from django.contrib import admin
from .models import ServiceRequest, StatusUpdate

class StatusUpdateInline(admin.TabularInline):
    model = StatusUpdate
    extra = 0

class ServiceRequestAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'created_at']
    inlines = [StatusUpdateInline]

admin.site.register(ServiceRequest, ServiceRequestAdmin)
admin.site.register(StatusUpdate)
