
class Sessions:
    def setSession(self, request, user):
        fields_to_set = [field.name for field in user._meta.fields if field.name not in ['password', 'date_created']]

        for field_name in fields_to_set:
            field_value = getattr(user, field_name)
            request.session[field_name] = field_value


