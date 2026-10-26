import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
)
from reportlab.pdfgen import canvas
from report_utils import get_academic_styles

class FirstFourPagesCanvas(canvas.Canvas):
    """
    Canvas for first four pages:
    Draws the academic rectangular outer border, but NO bottom page numbers.
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
            self.draw_border()
            super().showPage()
        super().save()

    def draw_border(self):
        self.saveState()
        self.setLineWidth(0.75)
        self.setStrokeColor(colors.black)
        self.rect(24, 24.5, 547.2, 793, stroke=1, fill=0)
        self.restoreState()


def generate_first_four_pages(output_pdf, project_subtitle="File & Document Organizer"):
    """
    Generates the customized first four pages:
    1. Cover Page
    2. Certificate
    3. Declaration
    4. Acknowledgement
    """
    doc = SimpleDocTemplate(
        output_pdf,
        pagesize=A4,
        leftMargin=50,
        rightMargin=50,
        topMargin=42,
        bottomMargin=42
    )

    styles = get_academic_styles()
    story = []

    logo_path = "/Users/srireddy/Desktop/files and document manager project/reports_source/assets/alliance_logo.png"
    logo_small_path = "/Users/srireddy/Desktop/files and document manager project/reports_source/assets/page_2_Image37.jpg"

    # =========================================================================
    # PAGE 1: COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>MINI PROJECT REPORT</b>", styles['DocTitle']))
    story.append(Spacer(1, 8))
    
    # Title requested by user: "File & Document Organizer"
    story.append(Paragraph(f"<i><b>{project_subtitle}</b></i>", styles['ChapterTitle']))
    story.append(Spacer(1, 14))

    story.append(Paragraph("Submitted by:", styles['DocTitle']))
    story.append(Paragraph("<b>Karumuri Utham Srireddy</b>", styles['DocTitle']))
    story.append(Paragraph("<b>2511021060237</b>", styles['DocTitle']))
    story.append(Spacer(1, 12))

    story.append(Paragraph("<i>In partial fulfilment for the award of the degree of</i>", styles['DocTitle']))
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>BACHELOR OF TECHNOLOGY</b>", styles['DocTitle']))
    story.append(Paragraph("In", styles['DocTitle']))
    story.append(Paragraph("<b>COMPUTER SCIENCE AND ENGINEERING</b>", styles['DocTitle']))
    story.append(Spacer(1, 12))

    story.append(Paragraph("Under the guidance of", styles['DocTitle']))
    story.append(Paragraph("<b>Mr. U. Vishvam</b>", styles['DocTitle']))
    story.append(Paragraph("Technical Mentor", styles['DocTitle']))
    story.append(Spacer(1, 12))

    if os.path.exists(logo_path):
        story.append(Image(logo_path, width=110, height=88))
    story.append(Spacer(1, 8))

    story.append(Paragraph("<b>Alliance School Of Advance Computing</b>", styles['DocTitle']))
    story.append(Paragraph("<b>Alliance University, Bengaluru</b>", styles['DocTitle']))
    story.append(Paragraph("<b>October-2026</b>", styles['DocTitle']))

    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: CERTIFICATE
    # =========================================================================
    story.append(Spacer(1, 10))
    if os.path.exists(logo_small_path):
        story.append(Image(logo_small_path, width=68, height=68))
    story.append(Spacer(1, 12))

    story.append(Paragraph("<b>COMPUTER SCIENCE AND ENGINEERING</b>", styles['DocTitle']))
    story.append(Paragraph("<b>ALLIANCE SCHOOL OF ADVANCED COMPUTING</b>", styles['DocTitle']))
    story.append(Spacer(1, 8))
    story.append(Paragraph("<u><b>CERTIFICATE</b></u>", styles['DocTitle']))
    story.append(Spacer(1, 16))

    cert_text = (
        "This is to certify that the report on <b>FileHub</b> is submitted by <b>Karumuri Utham Srireddy</b> "
        "[Uni. Roll No. <b>2511021060237</b>] in partial fulfilment for the award of the degree of "
        "<b>Bachelor of Technology (Computer Science and Engineering)</b> of Alliance University, "
        "is a bonafide work accomplished under my supervision and guidance during the academic year <b>2026</b>. "
        "This report embodies the results of original work and studies conducted by students and the contents "
        "do not form the basis for the award of any other degree to the candidate or anybody else."
    )
    story.append(Paragraph(cert_text, styles['Body']))
    story.append(Spacer(1, 65))

    sig_data = [
        ["", "--------------------------------------"],
        ["", "Mr. U. Vishvam"],
        ["", "Technical Mentor"]
    ]
    t_sig = Table(sig_data, colWidths=[275, 220])
    t_sig.setStyle(TableStyle([
        ('ALIGN', (1, 0), (1, -1), 'CENTER'),
        ('FONTNAME', (1, 1), (1, 1), 'Times-Bold'),
        ('FONTNAME', (1, 2), (1, 2), 'Times-Roman'),
        ('FONTSIZE', (1, 0), (1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
    ]))
    story.append(t_sig)

    story.append(PageBreak())

    # =========================================================================
    # PAGE 3: DECLARATION
    # =========================================================================
    story.append(Spacer(1, 10))
    if os.path.exists(logo_small_path):
        story.append(Image(logo_small_path, width=68, height=68))
    story.append(Spacer(1, 12))

    story.append(Paragraph("<b>COMPUTER SCIENCE AND ENGINEERING</b>", styles['DocTitle']))
    story.append(Paragraph("<b>ALLIANCE SCHOOL OF ADVANCED COMPUTING</b>", styles['DocTitle']))
    story.append(Spacer(1, 8))
    story.append(Paragraph("<u><b>DECLARATION</b></u>", styles['DocTitle']))
    story.append(Spacer(1, 16))

    decl_p1 = (
        "I hereby declare that the report titled <b>FileHub - File &amp; Document Organizer</b>, "
        "submitted by me in partial fulfilment of the requirements for the award of the degree of "
        "<b>Bachelor of Technology in Computer Science and Engineering (CSE)</b> at Alliance University, "
        "is a record of my original work carried out under the supervision of <b>Mr. U. Vishvam, Technical Mentor</b>."
    )
    decl_p2 = (
        "I further confirm that all views, findings, and conclusions expressed herein are the result of "
        "sincere effort and academic inquiry, and have been reviewed and deliberated in consultation with the assigned mentor."
    )
    decl_p3 = (
        "This declaration stands as a testament to the authenticity and integrity of the work submitted."
    )
    story.append(Paragraph(decl_p1, styles['Body']))
    story.append(Spacer(1, 10))
    story.append(Paragraph(decl_p2, styles['Body']))
    story.append(Spacer(1, 10))
    story.append(Paragraph(decl_p3, styles['Body']))
    story.append(Spacer(1, 65))

    decl_table_data = [
        ["Karumuri Utham Srireddy", "2511021060237", "________________"],
        ["Name of the Student", "University Registration Number", "Signature"]
    ]
    t_decl = Table(decl_table_data, colWidths=[180, 180, 135])
    t_decl.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Times-Bold'),
        ('FONTNAME', (0, 1), (-1, 1), 'Times-Roman'),
        ('FONTSIZE', (0, 0), (-1, -1), 9.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_decl)

    story.append(PageBreak())

    # =========================================================================
    # PAGE 4: ACKNOWLEDGEMENT
    # =========================================================================
    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>Acknowledgement</b>", styles['DocTitle']))
    story.append(Spacer(1, 16))

    ack_p1 = (
        "I would like to express my heartfelt gratitude to everyone who contributed to the successful "
        "completion of this project titled <b>FileHub - File &amp; Document Organizer</b>."
    )
    ack_p2 = (
        "First and foremost, I extend my sincere thanks to my mentor and guide, <b>Mr. U. Vishvam</b>, "
        "for his unwavering support, insightful feedback, and encouragement throughout the development "
        "of this system. His expertise in computer science and his commitment to fostering innovation "
        "provided the perfect foundation for this work."
    )
    ack_p3 = (
        "I am deeply grateful to my faculty members and peers whose guidance and technical inputs helped "
        "refine the project. Their collaborative spirit and constructive suggestions were instrumental in "
        "shaping the final outcome."
    )
    ack_p4 = (
        "This project allowed me to successfully design, develop, and deploy a robust full-stack document "
        "management system with modern user authentication and scalable cloud data persistence. It strengthened "
        "my belief in the power of technology to solve critical challenges in software engineering."
    )
    ack_p5 = (
        "Lastly, I would like to thank everyone who supported me directly or indirectly during this journey. "
        "Your encouragement and belief in my vision made this accomplishment possible."
    )
    ack_p6 = "Thank you."

    for p in [ack_p1, ack_p2, ack_p3, ack_p4, ack_p5, ack_p6]:
        story.append(Paragraph(p, styles['Body']))
        story.append(Spacer(1, 7))

    story.append(Spacer(1, 24))
    ack_name_data = [["", "Karumuri Utham Srireddy"]]
    t_ack = Table(ack_name_data, colWidths=[335, 160])
    t_ack.setStyle(TableStyle([
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
        ('FONTNAME', (1, 0), (1, 0), 'Times-Bold'),
        ('FONTSIZE', (1, 0), (1, 0), 11),
    ]))
    story.append(t_ack)

    doc.build(story, canvasmaker=FirstFourPagesCanvas)
    return output_pdf

if __name__ == "__main__":
    out = "/tmp/test_first_four.pdf"
    generate_first_four_pages(out)
    print("Generated first four pages successfully:", out)
