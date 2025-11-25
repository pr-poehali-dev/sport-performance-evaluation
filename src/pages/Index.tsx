import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface Question {
  id: number;
  text: string;
  options: { value: string; label: string }[];
}

interface TestResult {
  category: string;
  score: number;
  maxScore: number;
  color: string;
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    text: 'Как часто вы чувствуете мотивацию к достижению целей?',
    options: [
      { value: '5', label: 'Всегда' },
      { value: '4', label: 'Часто' },
      { value: '3', label: 'Иногда' },
      { value: '2', label: 'Редко' },
      { value: '1', label: 'Никогда' }
    ]
  },
  {
    id: 2,
    text: 'Насколько легко вам справляться со стрессом?',
    options: [
      { value: '5', label: 'Очень легко' },
      { value: '4', label: 'Легко' },
      { value: '3', label: 'Средне' },
      { value: '2', label: 'Сложно' },
      { value: '1', label: 'Очень сложно' }
    ]
  },
  {
    id: 3,
    text: 'Как вы оцениваете свою способность к концентрации?',
    options: [
      { value: '5', label: 'Отличная' },
      { value: '4', label: 'Хорошая' },
      { value: '3', label: 'Средняя' },
      { value: '2', label: 'Ниже среднего' },
      { value: '1', label: 'Плохая' }
    ]
  },
  {
    id: 4,
    text: 'Насколько уверенно вы чувствуете себя в новых ситуациях?',
    options: [
      { value: '5', label: 'Очень уверенно' },
      { value: '4', label: 'Уверенно' },
      { value: '3', label: 'Нейтрально' },
      { value: '2', label: 'Неуверенно' },
      { value: '1', label: 'Очень неуверенно' }
    ]
  },
  {
    id: 5,
    text: 'Как часто вы испытываете положительные эмоции?',
    options: [
      { value: '5', label: 'Постоянно' },
      { value: '4', label: 'Часто' },
      { value: '3', label: 'Иногда' },
      { value: '2', label: 'Редко' },
      { value: '1', label: 'Почти никогда' }
    ]
  }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('tests');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [testCompleted, setTestCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const progress = (Object.keys(answers).length / sampleQuestions.length) * 100;

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setTestCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = (): TestResult[] => {
    return [
      { category: 'Мотивация', score: parseInt(answers[1] || '0'), maxScore: 5, color: 'bg-[#8B5CF6]' },
      { category: 'Стрессоустойчивость', score: parseInt(answers[2] || '0'), maxScore: 5, color: 'bg-[#D946EF]' },
      { category: 'Концентрация', score: parseInt(answers[3] || '0'), maxScore: 5, color: 'bg-[#0EA5E9]' },
      { category: 'Уверенность', score: parseInt(answers[4] || '0'), maxScore: 5, color: 'bg-[#F97316]' },
      { category: 'Эмоциональность', score: parseInt(answers[5] || '0'), maxScore: 5, color: 'bg-[#8B5CF6]' }
    ];
  };

  const viewResults = () => {
    setActiveTab('results');
    setShowResults(true);
  };

  const restartTest = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setTestCompleted(false);
    setShowResults(false);
    setActiveTab('tests');
  };

  const results = calculateResults();
  const averageScore = results.reduce((sum, r) => sum + (r.score / r.maxScore) * 100, 0) / results.length;
  const comparisonData = {
    userAverage: averageScore,
    globalAverage: 68,
    betterThan: Math.round(averageScore * 1.2)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon name="Brain" size={48} className="text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              PsyTests
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Платформа психологического тестирования
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="tests" className="flex items-center gap-2">
              <Icon name="ClipboardList" size={18} />
              Тесты
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2" disabled={!showResults}>
              <Icon name="BarChart3" size={18} />
              Результаты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tests" className="animate-fade-in">
            {!testCompleted ? (
              <Card className="border-2 border-border/50 shadow-2xl backdrop-blur">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl">Психологический тест</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      Вопрос {currentQuestion + 1} из {sampleQuestions.length}
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="animate-scale-in">
                    <h3 className="text-xl font-semibold mb-6">
                      {sampleQuestions[currentQuestion].text}
                    </h3>
                    <RadioGroup
                      value={answers[sampleQuestions[currentQuestion].id]}
                      onValueChange={(value) => handleAnswer(sampleQuestions[currentQuestion].id, value)}
                    >
                      <div className="space-y-3">
                        {sampleQuestions[currentQuestion].options.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary transition-all cursor-pointer hover:bg-muted/50"
                          >
                            <RadioGroupItem value={option.value} id={option.value} />
                            <Label htmlFor={option.value} className="cursor-pointer flex-1 text-base">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex justify-between pt-6">
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentQuestion === 0}
                      className="gap-2"
                    >
                      <Icon name="ChevronLeft" size={18} />
                      Назад
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!answers[sampleQuestions[currentQuestion].id]}
                      className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    >
                      {currentQuestion === sampleQuestions.length - 1 ? 'Завершить' : 'Далее'}
                      <Icon name="ChevronRight" size={18} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-primary shadow-2xl animate-scale-in">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Icon name="CheckCircle" size={40} className="text-white" />
                  </div>
                  <CardTitle className="text-3xl">Тест завершён!</CardTitle>
                  <CardDescription className="text-lg">
                    Вы ответили на все {sampleQuestions.length} вопросов
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={viewResults}
                    className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 h-12 text-lg"
                  >
                    <Icon name="TrendingUp" size={20} className="mr-2" />
                    Посмотреть результаты
                  </Button>
                  <Button onClick={restartTest} variant="outline" className="w-full h-12">
                    <Icon name="RotateCcw" size={20} className="mr-2" />
                    Пройти заново
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-6 animate-fade-in">
            <Card className="border-2 border-border/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="Award" size={28} className="text-primary" />
                  Ваши результаты
                </CardTitle>
                <CardDescription>Детальная оценка по категориям</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {results.map((result, index) => (
                  <div key={index} className="space-y-2 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">{result.category}</span>
                      <span className="text-2xl font-bold text-primary">
                        {result.score}/{result.maxScore}
                      </span>
                    </div>
                    <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${result.color} transition-all duration-1000 ease-out rounded-full`}
                        style={{ width: `${(result.score / result.maxScore) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-2 border-border/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Icon name="Users" size={28} className="text-secondary" />
                  Сравнение с другими пользователями
                </CardTitle>
                <CardDescription>Как ваши результаты соотносятся со средними показателями</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30">
                    <div className="text-5xl font-bold text-primary mb-2">
                      {comparisonData.userAverage.toFixed(0)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Ваш средний балл</div>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30">
                    <div className="text-5xl font-bold text-accent mb-2">
                      {comparisonData.globalAverage}%
                    </div>
                    <div className="text-sm text-muted-foreground">Средний балл</div>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/30">
                    <div className="text-5xl font-bold text-secondary mb-2">
                      {comparisonData.betterThan}%
                    </div>
                    <div className="text-sm text-muted-foreground">Лучше чем других</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Сравнительный анализ</h4>
                  <div className="space-y-3">
                    {results.map((result, index) => {
                      const userPercent = (result.score / result.maxScore) * 100;
                      const avgPercent = 65 + Math.random() * 15;
                      
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{result.category}</span>
                            <div className="flex gap-4">
                              <span className="text-primary font-semibold">Вы: {userPercent.toFixed(0)}%</span>
                              <span className="text-muted-foreground">Средний: {avgPercent.toFixed(0)}%</span>
                            </div>
                          </div>
                          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                            <div
                              className="absolute h-full bg-muted-foreground/30 rounded-full"
                              style={{ width: `${avgPercent}%` }}
                            />
                            <div
                              className={`absolute h-full ${result.color} rounded-full transition-all duration-1000`}
                              style={{ width: `${userPercent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Button onClick={restartTest} className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-12">
                  <Icon name="RotateCcw" size={20} className="mr-2" />
                  Пройти тест снова
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
