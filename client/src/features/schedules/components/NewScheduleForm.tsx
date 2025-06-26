import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getUsers } from '@/api/userService';
import { getSubjects, type ApiSubject } from '@/api/subjectService';
import { getGroups, type ApiGroup } from '@/api/groupService';

const scheduleSchema = z.object({
  teacherId: z.string().min(1, "Debes seleccionar un docente."),
  subjectId: z.string().min(1, "Debes seleccionar una materia."),
  groupId: z.string().min(1, "Debes seleccionar un grupo."),
  fecha: z.string().min(1, "La fecha es requerida."),
  hora_inicio: z.string().min(1, "La hora de inicio es requerida."),
  hora_fin: z.string().min(1, "La hora de fin es requerida."),
  modalidad: z.enum(['PRESENCIAL', 'VIRTUAL', 'HIBRIDA']),
  aula: z.string().optional(),
});

export type ScheduleFormData = z.infer<typeof scheduleSchema>;

interface NewScheduleFormProps {
  onSubmit: (data: ScheduleFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const NewScheduleForm: React.FC<NewScheduleFormProps> = ({ onSubmit, onCancel, isSubmitting }) => {
  const { data: teachers } = useQuery({ queryKey: ['users'], queryFn: getUsers, select: (users) => users.filter(u => u.role === 'DOCENTE') });
  const { data: subjects = [] } = useQuery<ApiSubject[]>({ queryKey: ['subjects'], queryFn: getSubjects });
  const { data: groups = [] } = useQuery<ApiGroup[]>({ queryKey: ['groups'], queryFn: getGroups });

  const form = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: { modalidad: 'PRESENCIAL' },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField name="teacherId" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Docente</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona un docente..." /></SelectTrigger></FormControl><SelectContent>{teachers?.map(teacher => <SelectItem key={teacher.id} value={teacher.id}>{teacher.fullName}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
        )} />
        
        <FormField name="subjectId" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Materia</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona una materia..." /></SelectTrigger></FormControl><SelectContent>{subjects.map(subject => <SelectItem key={subject.id} value={subject.id}>{subject.name} ({subject.code})</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
        )} />

        <FormField name="groupId" control={form.control} render={({ field }) => (
          <FormItem><FormLabel>Grupo</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecciona un grupo..." /></SelectTrigger></FormControl><SelectContent>{groups.map(group => <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
        )} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField name="fecha" control={form.control} render={({ field }) => (<FormItem><FormLabel>Fecha</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField name="modalidad" control={form.control} render={({ field }) => (<FormItem><FormLabel>Modalidad</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="PRESENCIAL">Presencial</SelectItem><SelectItem value="VIRTUAL">Virtual</SelectItem><SelectItem value="HIBRIDA">Híbrida</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField name="hora_inicio" control={form.control} render={({ field }) => (<FormItem><FormLabel>Hora Inicio</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField name="hora_fin" control={form.control} render={({ field }) => (<FormItem><FormLabel>Hora Fin</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
         <FormField name="aula" control={form.control} render={({ field }) => (<FormItem><FormLabel>Aula/Enlace</FormLabel><FormControl><Input placeholder="Ej: Salón 201 o meet.google.com/xyz" {...field} /></FormControl><FormMessage /></FormItem>)} />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Crear Cronograma'}</Button>
        </div>
      </form>
    </Form>
  );
};