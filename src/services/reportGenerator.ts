import { Institution } from '@/types'

interface ReportOptions {
  type: 'performance' | 'improvement' | 'benchmark' | 'compliance' | 'data-export'
  institution: Institution
  dateRange?: { start: Date; end: Date }
}

export const generateReport = (options: ReportOptions): string => {
  const { type, institution } = options
  const generatedDate = new Date().toLocaleDateString()

  const commonStyles = `
    <style>
      @page { margin: 1in; }
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .header { text-align: center; border-bottom: 3px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
      .logo { font-size: 24px; font-weight: bold; color: #0284c7; }
      .title { font-size: 20px; font-weight: bold; margin: 20px 0; }
      .institution-name { font-size: 16px; color: #666; margin: 10px 0; }
      .section { margin: 30px 0; page-break-inside: avoid; }
      .section-title { font-size: 16px; font-weight: bold; color: #0284c7; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 15px; }
      table { width: 100%; border-collapse: collapse; margin: 15px 0; }
      th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
      th { background-color: #f9fafb; font-weight: bold; }
      .metric { display: inline-block; margin: 10px 20px 10px 0; }
      .metric-label { font-size: 12px; color: #666; }
      .metric-value { font-size: 24px; font-weight: bold; color: #0284c7; }
      .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; font-size: 12px; }
      .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 100px; color: rgba(0,0,0,0.05); z-index: -1; }
    </style>
  `

  switch (type) {
    case 'performance':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Performance Report - ${institution.name}</title>
          ${commonStyles}
        </head>
        <body>
          <div class="watermark">CONFIDENTIAL</div>
          <div class="header">
            <div class="logo">InstitutionHub</div>
            <div class="title">Monthly Performance Report</div>
            <div class="institution-name">${institution.name}</div>
            <div class="institution-name" style="font-size: 14px;">${institution.state} • ${institution.type}</div>
            <div style="margin-top: 10px; color: #666; font-size: 12px;">Generated: ${generatedDate}</div>
          </div>

          <div class="section">
            <div class="section-title">Executive Summary</div>
            <p>This report provides a comprehensive overview of ${institution.name}'s performance for the month of ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.</p>

            <div style="margin: 20px 0;">
              <div class="metric">
                <div class="metric-label">DSI Score</div>
                <div class="metric-value">${institution.currentDSI.toFixed(1)}%</div>
              </div>
              <div class="metric">
                <div class="metric-label">Composite Score</div>
                <div class="metric-value">${institution.compositeScore.toFixed(1)}</div>
              </div>
              <div class="metric">
                <div class="metric-label">Ranking</div>
                <div class="metric-value">#${institution.ranking}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Performance Metrics</div>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Score</th>
                  <th>Weight</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Faculty Quality</td>
                  <td>72.5</td>
                  <td>15%</td>
                  <td style="color: #eab308;">Needs Improvement</td>
                </tr>
                <tr>
                  <td>Research Output</td>
                  <td>68.3</td>
                  <td>20%</td>
                  <td style="color: #ef4444;">Below Benchmark</td>
                </tr>
                <tr>
                  <td>Infrastructure</td>
                  <td>88.7</td>
                  <td>10%</td>
                  <td style="color: #22c55e;">Excellent</td>
                </tr>
                <tr>
                  <td>Student Outcomes</td>
                  <td>76.4</td>
                  <td>20%</td>
                  <td style="color: #22c55e;">Good</td>
                </tr>
                <tr>
                  <td>Governance</td>
                  <td>82.1</td>
                  <td>15%</td>
                  <td style="color: #22c55e;">Good</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Key Findings</div>
            <ul>
              <li>Infrastructure quality exceeds sector benchmarks by 12%</li>
              <li>Research publications increased by 15% compared to last quarter</li>
              <li>Student placement rate maintained at 85%</li>
              <li>Faculty development programs show positive impact on teaching quality</li>
              <li>DSI score improved by 2.3 points since last month</li>
            </ul>
          </div>

          <div class="section">
            <div class="section-title">Recommendations</div>
            <ol>
              <li>Increase faculty with PhD qualifications to improve Faculty Quality score</li>
              <li>Enhance research collaboration with industry partners</li>
              <li>Implement additional skill development programs for students</li>
              <li>Maintain current infrastructure standards while exploring digital upgrades</li>
            </ol>
          </div>

          <div class="footer">
            <p><strong>InstitutionHub</strong> - Institutional Performance Tracking System</p>
            <p>This document is confidential and intended solely for ${institution.name}</p>
            <p>© ${new Date().getFullYear()} UGC/AICTE. All rights reserved.</p>
          </div>
        </body>
        </html>
      `

    case 'improvement':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>AI Improvement Report - ${institution.name}</title>
          ${commonStyles}
        </head>
        <body>
          <div class="watermark">AI GENERATED</div>
          <div class="header">
            <div class="logo">InstitutionHub AI</div>
            <div class="title">AI-Powered Improvement Recommendations</div>
            <div class="institution-name">${institution.name}</div>
            <div style="margin-top: 10px; color: #666; font-size: 12px;">Generated: ${generatedDate}</div>
          </div>

          <div class="section">
            <div class="section-title">AI Analysis Summary</div>
            <p>Our AI system has analyzed your institution's performance data and identified the following high-priority improvement areas:</p>
          </div>

          <div class="section">
            <div class="section-title">Priority 1: Faculty Quality Enhancement</div>
            <p><strong>Current Score:</strong> 72.0 | <strong>Target Score:</strong> 85.0</p>
            <p><strong>Potential Impact:</strong> +5.2 DSI points</p>
            <ul>
              <li>Increase faculty with PhD qualifications by 15% to match top performers</li>
              <li>Focus on recruiting experienced faculty (10+ years) for core departments</li>
              <li>Implement faculty development programs in emerging technologies</li>
            </ul>
          </div>

          <div class="section">
            <div class="section-title">Priority 2: Research Output Improvement</div>
            <p><strong>Current Score:</strong> 65.0 | <strong>Target Score:</strong> 78.0</p>
            <p><strong>Potential Impact:</strong> +4.5 DSI points</p>
            <ul>
              <li>Establish research collaboration with industry partners</li>
              <li>Allocate dedicated research hours for faculty members</li>
              <li>Create incentive structure for publishing in Q1/Q2 journals</li>
            </ul>
          </div>

          <div class="section">
            <div class="section-title">Priority 3: Student Outcomes</div>
            <p><strong>Current Score:</strong> 76.0 | <strong>Target Score:</strong> 82.0</p>
            <p><strong>Potential Impact:</strong> +6.1 DSI points</p>
            <ul>
              <li>Strengthen industry partnerships for placement opportunities</li>
              <li>Enhance skill development programs in high-demand areas</li>
              <li>Implement alumni mentorship programs</li>
            </ul>
          </div>

          <div class="footer">
            <p><strong>Powered by InstitutionHub AI</strong></p>
            <p>Recommendations based on machine learning analysis of historical performance data</p>
          </div>
        </body>
        </html>
      `

    case 'benchmark':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Benchmarking Report - ${institution.name}</title>
          ${commonStyles}
        </head>
        <body>
          <div class="header">
            <div class="logo">InstitutionHub</div>
            <div class="title">Comparative Benchmarking Report</div>
            <div class="institution-name">${institution.name}</div>
            <div style="margin-top: 10px; color: #666; font-size: 12px;">Generated: ${generatedDate}</div>
          </div>

          <div class="section">
            <div class="section-title">Performance Comparison</div>
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Your Institution</th>
                  <th>Top Performer</th>
                  <th>Sector Average</th>
                  <th>National Average</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>DSI Score</td>
                  <td><strong>${institution.currentDSI.toFixed(1)}</strong></td>
                  <td>92.5</td>
                  <td>76.1</td>
                  <td>68.5</td>
                </tr>
                <tr>
                  <td>Faculty Quality</td>
                  <td><strong>72.0</strong></td>
                  <td>88.0</td>
                  <td>75.0</td>
                  <td>70.0</td>
                </tr>
                <tr>
                  <td>Research Output</td>
                  <td><strong>65.0</strong></td>
                  <td>90.0</td>
                  <td>70.0</td>
                  <td>62.0</td>
                </tr>
                <tr>
                  <td>Infrastructure</td>
                  <td><strong>88.0</strong></td>
                  <td>92.0</td>
                  <td>80.0</td>
                  <td>75.0</td>
                </tr>
                <tr>
                  <td>Student Outcomes</td>
                  <td><strong>76.0</strong></td>
                  <td>91.0</td>
                  <td>74.0</td>
                  <td>68.0</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Key Insights</div>
            <p><strong>Strengths:</strong></p>
            <ul>
              <li>Infrastructure quality exceeds sector average by 10%</li>
              <li>Student outcomes above national benchmark</li>
            </ul>
            <p><strong>Areas for Improvement:</strong></p>
            <ul>
              <li>Research output trails top performers by 25 points</li>
              <li>Faculty quality needs enhancement to match sector leaders</li>
            </ul>
          </div>

          <div class="footer">
            <p><strong>InstitutionHub</strong> - Benchmarking Analytics</p>
          </div>
        </body>
        </html>
      `

    default:
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Report - ${institution.name}</title>
          ${commonStyles}
        </head>
        <body>
          <div class="header">
            <div class="logo">InstitutionHub</div>
            <div class="title">Institutional Report</div>
            <div class="institution-name">${institution.name}</div>
            <div style="margin-top: 10px; color: #666; font-size: 12px;">Generated: ${generatedDate}</div>
          </div>
          <div class="section">
            <p>Report generated successfully.</p>
          </div>
          <div class="footer">
            <p><strong>InstitutionHub</strong></p>
          </div>
        </body>
        </html>
      `
  }
}

export const downloadReport = (htmlContent: string, filename: string) => {
  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
