import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacidade',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './privacidade.component.html',
  styleUrl: './privacidade.component.scss'
})
export class PrivacidadeComponent {
  secoes = [
    {
      titulo: 'Quais dados coletamos',
      texto: 'A EVE coleta apenas os dados estritamente necessários para prestação dos serviços de bilheteria e comunidades: nome completo, endereço de e-mail e, quando aplicável, CPF para emissão de nota fiscal. Não coletamos dados de pagamento diretamente, transações são processadas por parceiros com certificação PCI-DSS. Não coletamos dados sensíveis conforme definidos pelo Art. 5º, II da LGPD.'
    },
    {
      titulo: 'Consentimento',
      texto: 'O tratamento dos seus dados é baseado no consentimento explícito fornecido no momento da inscrição em cada evento. Você pode revogar o consentimento a qualquer momento enviando solicitação para privacidade@eve.app.br. A revogação não afeta o tratamento realizado anteriormente ao pedido, conforme Art. 8º, §5º da LGPD.'
    },
    {
      titulo: 'Seus direitos',
      texto: 'Nos termos da Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a: confirmar a existência de tratamento; acessar os dados coletados; corrigir dados incompletos, inexatos ou desatualizados; solicitar a anonimização, bloqueio ou eliminação de dados desnecessários; portabilidade dos dados; revogar o consentimento. Para exercer esses direitos, entre em contato pelo e-mail privacidade@eve.app.br.'
    },
    {
      titulo: 'Compartilhamento de dados',
      texto: 'Seus dados são compartilhados exclusivamente com o organizador do evento para o qual você se inscreveu, apenas na medida necessária para gestão do credenciamento e comunicação sobre o evento. Não comercializamos dados pessoais a terceiros.'
    },
    {
      titulo: 'Segurança',
      texto: 'Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados: criptografia em trânsito (TLS 1.3), controle de acesso baseado em função (RBAC), logs de auditoria e plano de resposta a incidentes. Em caso de violação, notificaremos a ANPD e os afetados no prazo de 72 horas.'
    },
    {
      titulo: 'Retenção',
      texto: 'Os dados são retidos pelo período necessário para execução do contrato (duração do evento e período de suporte pós-evento de 90 dias). Após esse prazo, os dados são anonimizados ou eliminados, salvo obrigação legal de retenção maior.'
    },
    {
      titulo: 'Encarregado de dados (DPO)',
      texto: 'Dúvidas, solicitações e reclamações podem ser encaminhadas diretamente ao DPO pelo e-mail dpo@eve.app.br. Você também pode apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD) pelo site gov.br/anpd.'
    }
  ];
}
