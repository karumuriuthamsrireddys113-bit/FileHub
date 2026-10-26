import os
import io
import pypdf
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image, KeepTogether
)
from reportlab.pdfgen import canvas

SAMPLE_PDF_PATH = "/Users/srireddy/Downloads/Micro Project  Final Report (SAMPLE).pdf"

class NumberedCanvas(canvas.Canvas):
    """
    Custom canvas that draws the academic page border matching the sample PDF
    and writes the correct page number at the bottom center.
    Since the first 4 pages are prepended from the sample PDF,
    the generated pages start numbering at 5.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, total_pages):
        self.saveState()
        # Draw the exact outer rectangular border matching the sample PDF
        self.setLineWidth(0.75)
        self.setStrokeColor(colors.black)
        # Rect from x=24, y=24.5 with width=547.2, height=793 (A4 dimensions: 595.2 x 841.92)
        self.rect(24, 24.5, 547.2, 793, stroke=1, fill=0)

        # Page numbering: first 4 pages are from the original PDF, so page 1 of this canvas is page 5
        page_num = self._pageNumber + 4
        # The sample PDF TOC on page 5 has no bottom page number
        if page_num > 5:
            self.setFont("Times-Roman", 10)
            self.drawCentredString(A4[0] / 2.0, 32, str(page_num))
        self.restoreState()


def get_academic_styles():
    """
    Returns a dictionary of standardized ParagraphStyles for academic reports.
    """
    styles = getSampleStyleSheet()

    academic_styles = {
        'DocTitle': ParagraphStyle(
            'DocTitle',
            fontName='Times-Bold',
            fontSize=16,
            leading=20,
            alignment=TA_CENTER,
            spaceAfter=15,
            textColor=colors.black
        ),
        'ChapterTitle': ParagraphStyle(
            'ChapterTitle',
            fontName='Times-Bold',
            fontSize=15,
            leading=19,
            alignment=TA_CENTER,
            spaceBefore=12,
            spaceAfter=14,
            textColor=colors.black
        ),
        'SectionHeader': ParagraphStyle(
            'SectionHeader',
            fontName='Times-Bold',
            fontSize=12.5,
            leading=16,
            alignment=TA_LEFT,
            spaceBefore=12,
            spaceAfter=5,
            textColor=colors.black,
            keepWithNext=True
        ),
        'SubSectionHeader': ParagraphStyle(
            'SubSectionHeader',
            fontName='Times-Bold',
            fontSize=11,
            leading=14.5,
            alignment=TA_LEFT,
            spaceBefore=8,
            spaceAfter=3,
            textColor=colors.black,
            keepWithNext=True
        ),
        'Body': ParagraphStyle(
            'Body',
            fontName='Times-Roman',
            fontSize=10.5,
            leading=14.5,
            alignment=TA_JUSTIFY,
            spaceAfter=6,
            textColor=colors.black
        ),
        'BodyBold': ParagraphStyle(
            'BodyBold',
            fontName='Times-Bold',
            fontSize=10.5,
            leading=14.5,
            alignment=TA_JUSTIFY,
            spaceAfter=6,
            textColor=colors.black
        ),
        'Bullet': ParagraphStyle(
            'Bullet',
            fontName='Times-Roman',
            fontSize=10,
            leading=14,
            alignment=TA_LEFT,
            leftIndent=15,
            spaceAfter=3,
            textColor=colors.black
        ),
        'CodeLine': ParagraphStyle(
            'CodeLine',
            fontName='Courier',
            fontSize=8,
            leading=10.5,
            alignment=TA_LEFT,
            textColor=colors.HexColor('#0f172a')
        ),
        'TOCLeft': ParagraphStyle(
            'TOCLeft',
            fontName='Times-Roman',
            fontSize=10.5,
            leading=15,
            alignment=TA_LEFT,
            textColor=colors.black
        ),
        'TOCRight': ParagraphStyle(
            'TOCRight',
            fontName='Times-Roman',
            fontSize=10.5,
            leading=15,
            alignment=TA_RIGHT,
            textColor=colors.black
        ),
        'TOCSection': ParagraphStyle(
            'TOCSection',
            fontName='Times-Bold',
            fontSize=10.5,
            leading=15,
            alignment=TA_LEFT,
            textColor=colors.black
        ),
        'TableHeader': ParagraphStyle(
            'TableHeader',
            fontName='Times-Bold',
            fontSize=9.5,
            leading=12,
            alignment=TA_CENTER,
            textColor=colors.black
        ),
        'TableCell': ParagraphStyle(
            'TableCell',
            fontName='Times-Roman',
            fontSize=9,
            leading=11.5,
            alignment=TA_LEFT,
            textColor=colors.black
        ),
        'TableCellCenter': ParagraphStyle(
            'TableCellCenter',
            fontName='Times-Roman',
            fontSize=9,
            leading=11.5,
            alignment=TA_CENTER,
            textColor=colors.black
        ),
        'Callout': ParagraphStyle(
            'Callout',
            fontName='Times-Italic',
            fontSize=9.5,
            leading=13,
            alignment=TA_LEFT,
            leftIndent=12,
            rightIndent=12,
            spaceAfter=6,
            textColor=colors.HexColor('#334155')
        )
    }
    return academic_styles


def create_code_block(code_text):
    """
    Renders formatted code inside a clean, shaded table box.
    """
    code_text = code_text.strip()
    # Escape HTML special chars for Paragraph
    escaped = code_text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    lines = escaped.split('\n')
    formatted_html = '<br/>'.join([line.replace(' ', '&nbsp;') for line in lines])
    
    styles = get_academic_styles()
    p = Paragraph(formatted_html, styles['CodeLine'])
    
    table = Table([[p]], colWidths=[495])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('BOX', (0, 0), (-1, -1), 0.6, colors.HexColor('#cbd5e1')),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    return table


def create_toc_table(items):
    """
    Creates an academic Table of Contents table with clean dotted leader lines.
    items: list of tuples (title_string, page_number_string, is_bold)
    """
    styles = get_academic_styles()
    data = []
    for title, page, is_bold in items:
        style_title = styles['TOCSection'] if is_bold else styles['TOCLeft']
        style_page = styles['TOCSection'] if is_bold else styles['TOCRight']
        
        # Calculate dotted line
        # Left cell width 425 pt, right cell width 70 pt
        data.append([
            Paragraph(title, style_title),
            Paragraph(str(page), style_page)
        ])
    
    t = Table(data, colWidths=[435, 60])
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    return t


def merge_with_sample_first_four_pages(temp_generated_pdf, final_output_pdf):
    """
    Preserves pages 0, 1, 2, 3 of the original sample PDF and appends
    all pages from temp_generated_pdf.
    """
    if not os.path.exists(SAMPLE_PDF_PATH):
        raise FileNotFoundError(f"Original sample PDF not found at {SAMPLE_PDF_PATH}")
    
    reader_sample = pypdf.PdfReader(SAMPLE_PDF_PATH)
    reader_generated = pypdf.PdfReader(temp_generated_pdf)
    
    writer = pypdf.PdfWriter()
    
    # 1. Strictly copy the first 4 pages from original sample PDF
    for i in range(4):
        writer.add_page(reader_sample.pages[i])
        
    # 2. Append all newly generated pages
    for page in reader_generated.pages:
        writer.add_page(page)
        
    with open(final_output_pdf, 'wb') as f_out:
        writer.write(f_out)
        
    print(f"✅ Generated {final_output_pdf} (Total Pages: {len(writer.pages)})")
    return len(writer.pages)
