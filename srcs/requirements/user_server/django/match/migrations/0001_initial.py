# Generated by Django 5.0.4 on 2024-06-19 10:38

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='MatchHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('p1_score', models.PositiveIntegerField()),
                ('p2_score', models.PositiveIntegerField()),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('p1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='p1', to=settings.AUTH_USER_MODEL)),
                ('p2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='p2', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'indexes': [models.Index(fields=['p1'], name='match_match_p1_id_c7ba2d_idx'), models.Index(fields=['p2'], name='match_match_p2_id_0d33d5_idx')],
            },
        ),
    ]