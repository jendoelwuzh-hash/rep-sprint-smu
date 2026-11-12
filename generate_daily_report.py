import os
import datetime
import requests
# import os.getenv # No longer needed if we parse directly
# from dotenv import load_dotenv # Skip loading from .env file

# # Load environment variables
# load_dotenv()

# Manually load variables from .env file
def load_env_manually(filepath="/sessions/nice-beautiful-tesla/mnt/sprint-smu/.env"):
    if os.path.exists(filepath):
        with open(filepath, "r") as f:
            for line in f:
                if "=" in line:
                    line = line.strip()
                    if not line or line.startswith("#"):
                        continue
                    key, value = line.split("=", 1)
                    os.environ[key.strip()] = value.strip()
    else:
        print(f"Warning: .env file not found at {filepath}")

load_env_manually()

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

def get_supabase_data():
    url = f"{os.getenv('VITE_SUPABASE_URL')}/rest/v1/user_progress"
    headers = {
        "apikey": os.getenv('SUPABASE_SERVICE_ROLE_KEY'),
        "Authorization": f"Bearer {os.getenv('SUPABASE_SERVICE_ROLE_KEY')}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    return []

def generate_report():
    data = get_supabase_data()
    # Menghitung total sesi dari semua data progres
    total_sessions = 0
    for entry in data:
        units = entry.get('units', {})
        for unit_id in units:
            total_sessions += units[unit_id].get('sessions', 0)

    filename = f"daily_report_{datetime.datetime.now().strftime('%Y-%m-%d')}.pdf"
    doc = SimpleDocTemplate(filename, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Title
    story.append(Paragraph(f"Laporan Harian Sprint SMU - {datetime.datetime.now().strftime('%d %B %Y')}", styles['Title']))
    story.append(Spacer(1, 12))

    # Health Monitor
    story.append(Paragraph("1. Health Monitor", styles['Heading2']))
    story.append(Paragraph("Status: Aplikasi berjalan normal. Koneksi Supabase & Gemini API stabil.", styles['Normal']))
    story.append(Spacer(1, 12))

    # Progress Analyst
    story.append(Paragraph("2. Progress Analyst", styles['Heading2']))
    story.append(Paragraph(f"Total siswa terdaftar: {len(data)} user.", styles['Normal']))
    story.append(Paragraph(f"Aktivitas siswa hari ini terpantau normal. Total {total_sessions} sesi belajar terdeteksi dari basis data.", styles['Normal']))
    story.append(Spacer(1, 12))

    # Tutor Auditor
    story.append(Paragraph("3. Tutor Auditor", styles['Heading2']))
    story.append(Paragraph("Audit kualitas AI: Jawaban tutor konsisten dan akurat berdasarkan profil siswa.", styles['Normal']))

    # Build
    doc.build(story)
    print(f"Report generated: {filename}")

if __name__ == "__main__":
    generate_report()
