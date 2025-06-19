from sqlalchemy.orm import Session
from sqlalchemy import func, extract, desc
from datetime import datetime, date
from typing import List, Dict, Any
from calendar import month_name
import locale

import models

class ReportsService:
    def get_reports_data(self, db: Session, usuario_id: int, periodo: str) -> Dict[str, Any]:
        """
        Obtém dados agregados para relatórios baseado no período especificado.
        """
        current_date = datetime.now()
        
        if periodo == "mes_atual":
            month_filter = current_date.month
            year_filter = current_date.year
            pie_data = self._get_expenses_by_category_current_month(db, usuario_id, month_filter, year_filter)
            bar_data = self._get_monthly_data_current_year(db, usuario_id, current_date.year)
            summary_data = self._get_summary_data_current_month(db, usuario_id, month_filter, year_filter)
            
        elif periodo == "mes_anterior":
            if current_date.month == 1:
                month_filter = 12
                year_filter = current_date.year - 1
            else:
                month_filter = current_date.month - 1
                year_filter = current_date.year
            pie_data = self._get_expenses_by_category_current_month(db, usuario_id, month_filter, year_filter)
            bar_data = self._get_monthly_data_current_year(db, usuario_id, year_filter)
            summary_data = self._get_summary_data_current_month(db, usuario_id, month_filter, year_filter)
            
        else:
            pie_data = self._get_expenses_by_category_current_year(db, usuario_id, current_date.year)
            bar_data = self._get_monthly_data_current_year(db, usuario_id, current_date.year)
            summary_data = self._get_summary_data_current_year(db, usuario_id, current_date.year)
        
        return {
            "pieChartData": pie_data,
            "barChartData": bar_data,
            "summaryData": summary_data
        }
    
    def _get_expenses_by_category_current_month(self, db: Session, usuario_id: int, month: int, year: int) -> List[Dict[str, Any]]:
        """
        Obtém despesas agrupadas por categoria para o mês especificado.
        """
        results = db.query(
            models.CategoriaMov.nome,
            func.sum(models.Movimentacao.valor).label('total')
        ).join(
            models.Movimentacao, 
            models.CategoriaMov.idCategoria == models.Movimentacao.categoria_id
        ).filter(
            models.Movimentacao.usuario_id == usuario_id,
            models.Movimentacao.tipo == models.TipoMovimentacao.despesa,
            extract('month', models.Movimentacao.data_movimentacao) == month,
            extract('year', models.Movimentacao.data_movimentacao) == year
        ).group_by(
            models.CategoriaMov.nome
        ).all()
        
        colors = ['#1e40af', '#3b82f6', '#06b6d4', '#c4b5fd', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981']
        
        return [
            {
                "name": result.nome,
                "value": float(result.total),
                "color": colors[i % len(colors)]
            }
            for i, result in enumerate(results)
        ]
    
    def _get_expenses_by_category_current_year(self, db: Session, usuario_id: int, year: int) -> List[Dict[str, Any]]:
        """
        Obtém despesas agrupadas por categoria para o ano especificado.
        """
        results = db.query(
            models.CategoriaMov.nome,
            func.sum(models.Movimentacao.valor).label('total')
        ).join(
            models.Movimentacao, 
            models.CategoriaMov.idCategoria == models.Movimentacao.categoria_id
        ).filter(
            models.Movimentacao.usuario_id == usuario_id,
            models.Movimentacao.tipo == models.TipoMovimentacao.despesa,
            extract('year', models.Movimentacao.data_movimentacao) == year
        ).group_by(
            models.CategoriaMov.nome
        ).all()
        
        colors = ['#1e40af', '#3b82f6', '#06b6d4', '#c4b5fd', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981']
        
        return [
            {
                "name": result.nome,
                "value": float(result.total),
                "color": colors[i % len(colors)]
            }
            for i, result in enumerate(results)
        ]
    
    def _get_monthly_data_current_year(self, db: Session, usuario_id: int, year: int) -> List[Dict[str, Any]]:
        """
        Obtém dados mensais de receitas e despesas para o ano especificado.
        """
        receitas_query = db.query(
            extract('month', models.Movimentacao.data_movimentacao).label('month'),
            func.sum(models.Movimentacao.valor).label('total')
        ).filter(
            models.Movimentacao.usuario_id == usuario_id,
            models.Movimentacao.tipo == models.TipoMovimentacao.receita,
            extract('year', models.Movimentacao.data_movimentacao) == year
        ).group_by(
            extract('month', models.Movimentacao.data_movimentacao)
        ).all()
        
        despesas_query = db.query(
            extract('month', models.Movimentacao.data_movimentacao).label('month'),
            func.sum(models.Movimentacao.valor).label('total')
        ).filter(
            models.Movimentacao.usuario_id == usuario_id,
            models.Movimentacao.tipo == models.TipoMovimentacao.despesa,
            extract('year', models.Movimentacao.data_movimentacao) == year
        ).group_by(
            extract('month', models.Movimentacao.data_movimentacao)
        ).all()
        
        receitas_dict = {int(r.month): float(r.total) for r in receitas_query}
        despesas_dict = {int(d.month): float(d.total) for d in despesas_query}
        
        month_names = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
        
        monthly_data = []
        current_month = datetime.now().month
        
        for month_num in range(1, 13):
            if month_num <= current_month:
                monthly_data.append({
                    "month": month_names[month_num - 1],
                    "receitas": receitas_dict.get(month_num, 0),
                    "despesas": despesas_dict.get(month_num, 0)
                })
        
        return monthly_data
    
    def _get_summary_data_current_month(self, db: Session, usuario_id: int, month: int, year: int) -> Dict[str, float]:
        """
        Obtém dados de resumo para o mês especificado.
        """
        receitas_total = db.query(func.sum(models.Movimentacao.valor)).filter(
            models.Movimentacao.usuario_id == usuario_id,
            models.Movimentacao.tipo == models.TipoMovimentacao.receita,
            extract('month', models.Movimentacao.data_movimentacao) == month,
            extract('year', models.Movimentacao.data_movimentacao) == year
        ).scalar()
        
        despesas_total = db.query(func.sum(models.Movimentacao.valor)).filter(
            models.Movimentacao.usuario_id == usuario_id,
            models.Movimentacao.tipo == models.TipoMovimentacao.despesa,
            extract('month', models.Movimentacao.data_movimentacao) == month,
            extract('year', models.Movimentacao.data_movimentacao) == year
        ).scalar()
        
        receitas_total = float(receitas_total) if receitas_total else 0.0
        despesas_total = float(despesas_total) if despesas_total else 0.0
        saldo_final = receitas_total - despesas_total
        
        return {
            "receitas_totais": receitas_total,
            "despesas_totais": despesas_total,
            "saldo_final": saldo_final
        }
    
    def _get_summary_data_current_year(self, db: Session, usuario_id: int, year: int) -> Dict[str, float]:
        """
        Obtém dados de resumo para o ano especificado.
        """
        receitas_total = db.query(func.sum(models.Movimentacao.valor)).filter(
            models.Movimentacao.usuario_id == usuario_id,
            models.Movimentacao.tipo == models.TipoMovimentacao.receita,
            extract('year', models.Movimentacao.data_movimentacao) == year
        ).scalar()
        
        despesas_total = db.query(func.sum(models.Movimentacao.valor)).filter(
            models.Movimentacao.usuario_id == usuario_id,
            models.Movimentacao.tipo == models.TipoMovimentacao.despesa,
            extract('year', models.Movimentacao.data_movimentacao) == year
        ).scalar()
        
        receitas_total = float(receitas_total) if receitas_total else 0.0
        despesas_total = float(despesas_total) if despesas_total else 0.0
        saldo_final = receitas_total - despesas_total
        
        return {
            "receitas_totais": receitas_total,
            "despesas_totais": despesas_total,
            "saldo_final": saldo_final
        }

reports_service_instance = ReportsService()
